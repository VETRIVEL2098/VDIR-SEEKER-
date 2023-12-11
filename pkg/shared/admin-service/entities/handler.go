package entities

import (
	"context"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/mail.v2"

	"v-dir/pkg/shared"
	"v-dir/pkg/shared/database"
	"v-dir/pkg/shared/helper"

	"go.mongodb.org/mongo-driver/mongo/options"

	"v-dir/pkg/shared/utils"
)

var updateOpts = options.Update().SetUpsert(true)

var fileUploadPath = ""
var ctx = context.Background()

// PostDocHandler --METHOD Data insert to mongo Db with Proper Field Validation
func PostDocHandler(c *fiber.Ctx) error {
	org, exists := helper.GetOrg(c)
	if !exists {
		return shared.BadRequest("Invalid Org Id")
	}

	userToken := utils.GetUserTokenValue(c)
	// modelName := c.Params("model_name")

	// collectionName, err := helper.CollectionNameGet(modelName, org.Id)
	// if err != nil {
	// 	return shared.BadRequest("Invalid CollectionName")
	// }

	// inputData, errmsg := helper.InsertValidateInDatamodel(collectionName, string(c.Body()), org.Id)
	// if errmsg != nil {
	// errmsg is map to string
	// 	for key, value := range errmsg {
	// 		return shared.BadRequest(fmt.Sprintf("%s is a %s", key, value))
	// 	}
	// }

	collectionName := c.Params("model_name")
	var inputData map[string]interface{}
	c.BodyParser(&inputData)
	// to paras the Datatype
	helper.UpdateDateObject(inputData)
	handleIDGeneration(inputData, org.Id)

	if collectionName == "user" {
		err := OnboardingProcessing(org.Id, inputData["_id"].(string), "Onboarding", "user")
		if err != nil {
			return shared.BadRequest("Invalid user Id")
		}
	} else if collectionName == "data_model" || collectionName == "model_config" {
		inputData["status"] = "A"
	}

	inputData["created_on"] = time.Now()
	inputData["created_by"] = userToken.UserId

	res, err := Insert(org.Id, collectionName, inputData)
	if err != nil {
		return shared.BadRequest("Failed to insert data into the database " + err.Error())
	}

	if collectionName == "data_model" && res.InsertedID != nil {
		go helper.ServerInitstruct(org.Id)
	}

	return shared.SuccessResponse(c, fiber.Map{
		"message":   "Insert Successfully",
		"insert ID": res.InsertedID,
	})
}

func Insert(orgId string, collectionName string, inputData map[string]interface{}) (*mongo.InsertOneResult, error) {
	res, err := database.GetConnection(orgId).Collection(collectionName).InsertOne(ctx, inputData)

	return res, err
}

// handleIDGeneration generates or handles the ID in the input data.
func handleIDGeneration(inputData bson.M, orgID string) {
	if inputData["_id"] != nil {
		result, err := helper.HandleSequenceOrder(inputData["_id"].(string), orgID)
		if err == nil {
			inputData["_id"] = result
		}
	} else {
		// fmt.Println("sdagsd")
		inputData["_id"] = helper.Generateuniquekey()
	}
}

func GetDocByIdHandler(c *fiber.Ctx) error {
	orgId := c.Get("OrgId")
	if orgId == "" {
		return shared.BadRequest("Organization Id missing")
	}
	filter := helper.DocIdFilter(c.Params("id"))
	collectionName := c.Params("collectionName")
	response, err := helper.GetQueryResult(orgId, collectionName, filter, int64(0), int64(1), nil)
	if err != nil {
		return shared.BadRequest(err.Error())
	}
	return shared.SuccessResponse(c, response)
}

func DeleteById(c *fiber.Ctx) error {
	//Get the orgId from Header
	org, exists := helper.GetOrg(c)
	if !exists {

		return shared.BadRequest("Invalid Org Id")
	}

	//Filter conditon for common
	filter := helper.DocIdFilter(c.Params("id"))
	//user_files collection that time Delete S3 files
	if c.Params("collectionName") == "user_files" {
		return helper.DeleteFileIns3(c)
	}
	// Delete the Data from COllectionName
	_, err := database.GetConnection(org.Id).Collection(c.Params("collectionName")).DeleteOne(ctx, filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error deleting document"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Document successfully deleted"})
}

func DeleteByAll(c *fiber.Ctx) error {
	//Get the orgId from Header
	org, exists := helper.GetOrg(c)
	if !exists {

		return shared.BadRequest("Invalid Org Id")
	}
	collectionName := c.Params("collectionName")

	filter := bson.M{}
	_, err := database.GetConnection(org.Id).Collection(collectionName).DeleteMany(ctx, filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error deleting documents"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Documents successfully deleted"})
}

func putDocByIDHandlers(c *fiber.Ctx) error {
	//Get the orgId from Header
	org, exists := helper.GetOrg(c)
	if !exists {

		return shared.BadRequest("Invalid Org Id")
	}
	// to  Get the User Details from Token
	userToken := utils.GetUserTokenValue(c)

	// collectionName, err := helper.CollectionNameGet(c.Params("model_name"), org.Id)
	// if err != nil {
	// return shared.BadRequest("Invalid CollectionName")
	// }

	// // Validate the input data based on the data model
	// inputData, validationErrors := helper.UpdateValidateInDatamodel(collectionName, string(c.Body()), org.Id)
	// if validationErrors != nil {
	// 	//Handle validation errors with status code 400 (Bad Request)
	// 	jsonstring, _ := json.Marshal(validationErrors)
	// 	return shared.BadRequest(string(jsonstring))
	// }

	// updatedDatas := make(map[string]interface{})
	// // update for nested fields
	// UpdateData := helper.UpdateFieldsWithParentKey(inputData, "", updatedDatas)
	collectionName := c.Params("model_name")
	var UpdateData map[string]interface{}
	c.BodyParser(&UpdateData)
	helper.UpdateDateObject(UpdateData)

	update := bson.M{
		"$set": UpdateData,
	}

	UpdateData["update_on"] = time.Now()
	UpdateData["update_by"] = userToken.UserId
	// Update data in the collection
	res, err := database.GetConnection(org.Id).Collection(collectionName).UpdateOne(ctx, helper.DocIdFilter(c.Params("id")), update, updateOpts)
	if err != nil {
		// Handle database update error with status code 500 (Internal Server Error)
		return shared.BadRequest(err.Error())
	}

	if c.Params("model_name") == "data_model" {
		if res.UpsertedID != nil {

			helper.ServerInitstruct(org.Id)
		}
	}
	return shared.SuccessResponse(c, "Updated Successfully")
}

// getDocsHandler --METHOD get the data from Db with pagination
func getDocsHandler(c *fiber.Ctx) error {
	orgId := c.Get("OrgId")
	if orgId == "" {
		return shared.BadRequest("Organization Id missing")
	}
	// collectionName := c.Params("collectionName")
	var requestBody helper.PaginationRequest

	if err := c.BodyParser(&requestBody); err != nil {
		return nil
	}

	var pipeline []primitive.M
	pipeline = helper.MasterAggregationPipeline(requestBody, c)

	PagiantionPipeline := helper.PagiantionPipeline(requestBody.Start, requestBody.End)
	pipeline = append(pipeline, PagiantionPipeline)
	Response, err := helper.GetAggregateQueryResult(orgId, c.Params("collectionName"), pipeline)

	if err != nil {
		if cmdErr, ok := err.(mongo.CommandError); ok {
			return shared.BadRequest(cmdErr.Message)
		}
	}
	fmt.Println(Response)
	return shared.SuccessResponse(c, Response)
}

// !pending
// OnboardingProcessing  -- METHOD Onboarding processing for user and send the email
func OnboardingProcessing(orgId, email, emailtype, category string) error {
	// Generate the 'decoding' value (replace this with your actual logic)
	decoding := helper.Generateuniquekey()

	filter := bson.A{
		bson.D{
			{"$match",
				bson.D{
					{"title", category},
					{"emailtype", emailtype},
				},
			},
		},
	}

	Response, err := helper.GetAggregateQueryResult(orgId, "email_template", filter)
	if err != nil {
		fmt.Println("Err",
			err.Error(),
		)

	}

	if err := SimpleEmailHandler(email, os.Getenv("CLIENT_EMAIL"), "Welcome to pms Onboarding", replacestring(Response[0]["template"].(string), fmt.Sprintf("%s%s%s", Response[0]["link"].(string), `=`, decoding))); err == nil {
		// If email sending was successful
		if err := UsertemporaryStoringData(email, decoding); err != nil {
			log.Println("Failed to insert user junked files:", err)
		}
	} else {
		return shared.BadRequest("Email sending failed:")
	}

	return nil
}

func replacestring(template, Replacement string) string {

	return strings.ReplaceAll(template, `{{link}}`, Replacement)
}

// todo sekers
// USER ON BOARDING TEMPLATE  //todo
func createOnBoardtemplate(link string) string {

	body := `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Welcome to Our Onboarding Process</title>
	</head>
	<body>
		<table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
			<tr>
				<td align="center">
					<table cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
						<tr>
							<td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0; border-top: 3px solid #007BFF;">
								<h1>Welcome to Our Onboarding Process</h1>
								<p>Thank you for choosing our services. We are excited to have you on board!</p>
								<p>Please follow the steps below to get started:</p>
								<ol>
									<div>Step 1: Complete your profile</div>
									<div>Step 2: Explore our platform</div>
									<div>Step 3: Contact our support team if you have any questions</div>
								</ol>
								<p>Enjoy your journey with us!</p>
								<p>
								<a href="{{link}}" style="background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">Activation Now</a>
								</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
	</html>`

	return body
}

func UsertemporaryStoringData(requestMail, appToken string) error {
	requestData := bson.M{
		"_id":        requestMail,
		"access_key": appToken,
		"expire_on":  time.Now(),
	}

	_, err := database.GetConnection("pms").Collection("temporary_user").InsertOne(ctx, requestData)

	if err != nil {
		// Log the detailed error for debugging
		log.Println("Failed to insert data into the database:", err.Error())
		return shared.BadRequest("Failed to insert data into the database")
	}

	return nil
}
func SendEmail(recipientEmail, subject, body string) error {
	m := mail.NewMessage()
	check := isValidEmail(recipientEmail)
	if !check {
		return fiber.NewError(400, "Invalid Email Id")
	}
	// SenderEmail := os.Getenv("Sender_Email")
	// EmailKey := os.Getenv("Email_Key")
	m.SetHeader("From", "seekerofficialjp@gmail.com")
	m.SetHeader("To", recipientEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := mail.NewDialer("smtp.gmail.com", 587, "seekerofficialjp@gmail.com", "yzujyrzzvkgrvhbo") // Replace with your SMTP server address, port, and password

	err := d.DialAndSend(m)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("Email sending error: %v", err)
	}
	return nil
}
func isValidEmail(email string) bool {
	// Regular expression for basic email validation
	regex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$`
	match, _ := regexp.MatchString(regex, email)
	return match
}

func SimpleEmailHandler(recipientEmail string, senderEmail string, subject string, body string) error {
	email := mail.NewMessage()
	email.SetHeader("From", senderEmail)
	email.SetHeader("To", recipientEmail)

	email.SetHeader("Subject", subject)
	email.SetBody("text/html", body)

	sendinmail := mail.NewDialer("smtp.gmail.com", 587, senderEmail, os.Getenv("CLIENT_EMAIL_PASSWORD"))

	err := sendinmail.DialAndSend(email)
	if err != nil {
		return err
	}

	return nil
}

func getFileDetails(c *fiber.Ctx) error {
	orgId := c.Get("OrgId")
	if orgId == "" {
		return shared.BadRequest("Organization Id missing")
	}
	fileCategory := c.Params("folder")
	refId := c.Params("refId")
	//	token := shared.GetUserTokenValue(c)
	query := bson.M{"ref_id": refId, "folder": fileCategory}

	response, err := helper.GetQueryResult(orgId, "user_files", query, int64(0), int64(200), nil)
	if err != nil {
		return shared.BadRequest(err.Error())
	}

	return shared.SuccessResponse(c, response)
}

func getAllFileDetails(c *fiber.Ctx) error {
	orgId := c.Get("OrgId")
	if orgId == "" {
		return shared.BadRequest("Organization Id missing")
	}
	fileCategory := c.Params("category")
	//status := c.Params("status")
	page := c.Params("page")
	limit := c.Params("limit")
	query := bson.M{"category": fileCategory}
	response, err := helper.GetQueryResult(orgId, "user_files", query, helper.Page(page), helper.Limit(limit), nil)
	if err != nil {
		return shared.BadRequest(err.Error())
	}
	return shared.SuccessResponse(c, response)
}

func UpdateVisitor(c *fiber.Ctx) error {
	orgId := c.Get("OrgId")
	if orgId == "" {
		return shared.BadRequest("Organization Id missing")
	}
	id := c.Params("id")
	collectionName := c.Params("collectionName")

	// Parse the request body as a map[string]interface{}
	data := make(map[string]interface{})
	// data["update_on"] = time.Now()
	if err := c.BodyParser(&data); err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).SendString("Error parsing request body")
	}

	// fmt.Println(data["visitors"])
	err := UpdateVisitedCount(c, collectionName, id, data, orgId)
	if err != nil {
		log.Println(err)
		// if errors.Is(err, fiber.ErrNotFound) {
		// 	return c.Status(fiber.StatusNotFound).SendString("Updating data error")
		// }
		return c.Status(fiber.StatusInternalServerError).SendString("Error updating document")
	}

	return nil
}

func UpdateVisitedCount(c *fiber.Ctx, collectionName string, id string, updateData interface{}, OrgId string) error {
	// Check if the database connection is already established

	var filter interface{}
	var err error

	if primitive.IsValidObjectID(id) {
		// For other collections, convert ID to ObjectID type if it's a valid ObjectID
		objectID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			log.Println(err)
			return c.Status(fiber.StatusBadRequest).SendString("Invalid object ID")
		}
		filter = bson.M{"_id": objectID}
	} else {
		// If the ID is not a valid ObjectID, return an error
		return c.Status(fiber.StatusBadRequest).SendString("Invalid object ID")
	}

	// Check if the visitor exists in the database
	var visitorExists bool
	err = database.GetConnection(OrgId).Collection(collectionName).FindOne(context.Background(), filter).Decode(&visitorExists)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusInternalServerError).SendString("Error checking visitor existence")
	}

	if !visitorExists {
		// If the visitor does not exist, update the count
		var inputdata map[string]interface{}
		for _, value := range updateData.(map[string]interface{}) {
			for _, dats := range value.([]interface{}) {
				inputdata = dats.(map[string]interface{})
			}
		}

		update := bson.M{
			"$addToSet": bson.M{
				"visitors": bson.M{
					"firstName":   inputdata["firstName"].(string),
					"email":       inputdata["email"].(string),
					"address":     inputdata["address"].(string),
					"visitedDate": time.Now(),
				},
			},
		}
		result, err := database.GetConnection(OrgId).Collection(collectionName).UpdateOne(ctx, filter, update)
		if err != nil {
			log.Println(err)
			return c.Status(fiber.StatusInternalServerError).SendString("Error updating document")
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"data":    result,
			"status":  fiber.StatusOK,
			"message": "Data updated successfully",
		})
	} else {
		// If the visitor already exists, return an error
		return c.Status(fiber.StatusBadRequest).SendString("Visitor already exists")
	}
}

func FindMatchingDocuments(c *fiber.Ctx) error {
	collectionName := c.Params("collectionName")
	var inputData map[string]interface{}
	err1 := c.BodyParser(&inputData)
	if err1 != nil {
		log.Println(err1)
	}

	// Initialize an empty filter
	filter := bson.A{}

	// Check for role parameter
	if roles, found := inputData["role"]; found {
		filter = append(filter, bson.D{
			{"$match", bson.D{
				{"role", bson.D{
					{"$in", roles.([]interface{})},
				}},
			}},
		})
	}

	// Check for salary parameter
	if salaries, found := inputData["salary"]; found {
		filter = append(filter, bson.D{
			{"$match", bson.D{
				{"salary", bson.D{
					{"$in", salaries.([]interface{})},
				}},
			}},
		})
	}

	// Check for industryType parameter
	if industry, found := inputData["industry"]; found {
		filter = append(filter, bson.D{
			{"$match", bson.D{
				{"industry", bson.D{
					{"$in", industry.([]interface{})},
				}},
			}},
		})
	}

	// Check for workmode parameter
	if workmodes, found := inputData["workmode"]; found {
		filter = append(filter, bson.D{
			{"$match", bson.D{
				{"workmode", bson.D{
					{"$in", workmodes.([]interface{})},
				}},
			}},
		})
	}

	// Check for employmentType parameter
	if employmentTypes, found := inputData["employmentType"]; found {
		filter = append(filter, bson.D{
			{"$match", bson.D{
				{"employmentType", bson.D{
					{"$in", employmentTypes.([]interface{})},
				}},
			}},
		})
	}

	// Check for Education parameter
	if educations, found := inputData["Education"]; found {
		educationValues := []string{}
		for _, edu := range educations.([]interface{}) {
			if e, ok := edu.(map[string]interface{}); ok {
				if value, ok := e["education"].(string); ok {
					educationValues = append(educationValues, value)
				}
			}
		}
		filter = append(filter, bson.D{
			{"$match", bson.D{
				{"Education.education", bson.D{
					{"$in", educationValues},
				}},
			}},
		})
	}

	// Check for Experience parameter

	if experience, found := inputData["Experience"]; found {
		// if exp-, err := strconv.Atoi(fmt.Sprintf("%v", experience)); err == nil {
		// 	filter = append(filter, bson.D{
		// 		{"$match", bson.D{
		// 			// {"$or", bson.A{
		// 			// bson.D{{"Experience", bson.D{{"$gte", exp}}}}, // Greater than or equal to the provided experience
		// 			// bson.D{
		// 			{"Experience", bson.D{{"$lte", exp}}}, // }
		// 			// Less than or equal to the provided experience
		// 			// }},
		// 		}},
		// 	})

		// }
		fil := bson.A{
			bson.D{
				{"$match",
					bson.D{
						{"$and",
							bson.A{
								bson.D{{"MaximumExperience", bson.D{{"$gte", experience}}}},
								bson.D{{"MinimumExperience", bson.D{{"$lte", experience}}}},
							},
						},
					},
				},
			},
		}
		filter = append(filter, fil...)

	}
	fmt.Println(".................")
	fmt.Println(filter)
	// Perform aggregation
	cursor, err := database.GetConnection("OrgId").Collection(collectionName).Aggregate(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(context.Background())

	// Iterate through the results
	var results []bson.M
	if err := cursor.All(context.Background(), &results); err != nil {
		log.Fatal(err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": 200,
		"data":   results,
	})
}
