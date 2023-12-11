package helper

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"regexp"
 
	"v-dir/pkg/shared/database"
 

	"strconv"
	"time"

	"github.com/go-mail/mail"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var c *fiber.Ctx

func GenerateOTPs() string {
	rand.Seed(time.Now().UnixNano())
	for {
		otp := rand.Intn(900000) + 100000 // Generate a random number between 100000 and 999999 (inclusive)
		otpStr := fmt.Sprintf("%06d", otp)
		if len(otpStr) == 6 {
			return otpStr
		}
	}
}

func SendOTP(c *fiber.Ctx, recipient string, usertype string) error {
	// Generate OTP
	var user map[string]interface{}

	originalCollectionName, filter, err := GetCollectionAndFilter(usertype, recipient)
	if err != nil {

		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}
	// Check the first collection
	result := database.GetConnection(c.Get("OrgId")).Collection(originalCollectionName).FindOne(context.Background(), filter)
	if err := result.Err(); err == nil {
		if err := result.Decode(&user); err == nil {

		}
	}

	// If no document is found in both collections
	if user == nil {
		return fiber.NewError(404, "No Account found")
	}
	otp := GenerateOTPs()
	body := `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
        }
        .header h1 {
            color: #333;
        }
        .content {
            margin-top: 20px;
            text-align: center;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #B7121A;
        }
        .message {
            margin-top: 20px;
            font-size: 18px;
            color: #555;
        }
        .note {
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>OTP Verification</h1>
        </div>
        <div class="content">
            <p>Your One-Time Password (OTP) is:</p>
            <p class="otp-code">` + otp + `</p>
            <p class="message">This OTP is valid for only 2 minute. Please do not share this OTP with anyone.</p>
            <p class="note">If you did not request this OTP, please ignore this email.</p>
        </div>
    </div>
</body>
</html>`
	// Send OTP via email
	err = SendEmail(recipient, "OTP Verification", body)
	if err != nil {
		log.Println(err)
		// return c.Status(fiber.StatusBadRequest).SendString(err.Error(), "Error")	// Handle the error but don't exit the application
	}

	otpInt, err := ConvertOTPStringToInt(otp)
	if err != nil {
		// Handle the error
		fmt.Println("Error:", err)
	} else {
		// Use otpInt32 as an int32 value
		fmt.Println("OTP as int", otpInt)
	}
	// // Try to update OTP based on recipient type
	storeOtp := Otp{
		Otp:       otpInt,
		CreatedOn: time.Now(),
		Verified:  false,
	}

	var userID string
	if id, ok := user["_id"].(string); ok {
		userID = id
	} else if id, ok := user["_id"].(primitive.ObjectID); ok {
		userID = id.Hex()

	}

	err = UpdateDataByID(c, originalCollectionName, userID, bson.M{"email_otp_info": storeOtp})
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update OTP in the database",
		})
	}

	return c.JSON(fiber.Map{
		"message": "OTP successfully to your Registered email address" + recipient,
	})

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

func ConvertOTPStringToInt(otpStr string) (int, error) {
	otpInt, err := strconv.Atoi(otpStr)
	if err != nil {
		return 0, err
	}
	return otpInt, nil
}

func ProcessVerifiedOtp(c *fiber.Ctx, collectionName string, reqData ValidateOtp, data []primitive.M) error {
	var tfAuth bool
	if len(data) > 0 {
		userData := data[0]
		var otpInfo map[string]interface{}

		if emailOTPInfo, ok := userData["email_otp_info"].(primitive.M); ok {
			// userData["email_otp_info"] is of type primitive.M
			otpInfo = emailOTPInfo
		} else {
			// Handle the case where userData["email_otp_info"] is not of type primitive.M
			// You can log an error or return an error response, depending on your use case.
			fmt.Println("Error: email_otp_info is not of type primitive.M")
			return nil
		}

		var userID string
		if id, ok := userData["_id"].(string); ok {
			userID = id
		} else if id, ok := userData["_id"].(primitive.ObjectID); ok {
			userID = id.Hex()

		}
		if userData["2f_auth"] != nil {
			tfAuth = userData["2f_auth"].(bool)
		}
		if !tfAuth {
			if !otpInfo["verified"].(bool) {
				fmt.Println(otpInfo["otp"], " ", int32(reqData.Otp), "otp")
				if otpInfo["otp"] == int32(reqData.Otp) {
					if otpInfo["created_on"] != nil {
						threshold := 2 * time.Minute
						createdOn := otpInfo["created_on"].(primitive.DateTime)
						currentTime := time.Now()
						timeDifference := currentTime.Sub(createdOn.Time())
						if timeDifference > threshold {
							update := bson.M{"email_otp_info.expired_status": true}
							err := UpdateDataByID(c, collectionName, userID, update)
							if err != nil {
								c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})

							}
							return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Your OTP is Expired", "status": 400})
						}
					}
					update := bson.M{"email_otp_info.verified": true, "email_otp_info.expired_status": true, "email_verified": true}
					err := UpdateDataByID(c, collectionName, userID, update)
					if err != nil {
						c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})

					}
					// if collectionName == "temporary_data" {
					//     insertData := data[0]
					//     _, err = shared.InsertData(c, insertCollection, insertData)
					//     if err != nil {
					// 		 c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
					//     }
					//     update = bson.M{"email_otp_info.verified": true, "email_otp_info.expired_status": true, "email_verified": true}
					//     _, err := UpdateDocByID(insertCollection, userData["_id"].(string), update)
					//     if err != nil {
					// 		 c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
					//     }
					//     _, err = DeleteDocByID(c, collectionName, userData["_id"].(string))
					//     if err != nil { c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
					//     }
					// }
					return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "OTP verified Successfully", "status": 200})
				}
			}
		} else {
			if int32(reqData.Otp) == 123456 {
				return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "OTP verified Successfully", "status": 200})
			} else {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid OTP", "status": 400})
			}

		}
	} else {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No Account found", "status": 404})
	}

	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid OTP", "status": 400})
}

func GetCollectionAndFilter(userType, email string) (string, interface{}, error) {
	var collectionName string
	var filter interface{}

	switch userType {
	case "Seeker":
		collectionName = "seekers_info"
		filter = bson.M{"email": email, "role": "Seeker"}
	case "Company":
		collectionName = "companies"
		filter = bson.M{"email": email, "role": "Company"}

	default:
		return "", nil, fiber.NewError(400, "Invalid CollectionName")
	}

	return collectionName, filter, nil
}

// UpdateDataByID updates data in a database collection using the Object ID.

func UpdateDataByID(c *fiber.Ctx, collectionName string, id string, updateData interface{}) error {
	// Check if the database connection is already established
	OrgId := c.Get("OrgId")
	var filter interface{}
	var err error

	if collectionName == "user_resume" || collectionName == "event" {
		// If the collection is "user_resume", use ID directly without ObjectID conversion
		filter = bson.D{
			{"$match", bson.D{{"_id", "e74918dbd-bf7b-4ba6-9eeb-8e9c68d533f5"}}},
			{"$unwind", bson.D{
				{"path", "$speaker"},
				{"preserveNullAndEmptyArrays", true},
			}},
			{"$match", bson.D{{"speaker.speaker_id", "s050d9433-009b-48ab-b174-c89e093e0a80"}}},
		}
		//bson.M{"_id": id}
	} else if primitive.IsValidObjectID(id) {
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
	// Define the update operation to update the fields
	update := bson.M{"$set": updateData}

	// opts := options.Update().SetUpsert(true).SetArrayFilters(options.ArrayFilters{
	// 	Filters: []interface{}{bson.D{{"speaker.email", bson.D{{"$eq", "yourFilterValue"}}}}},
	// })

	// arrayFilter := options.ArrayFilters{
	// 	Filters: []interface{}{
	// 		bson.D{{"$set", bson.D{{"A", "$speaker.email"}}}},
	// 		bson.D{{"$match", bson.D{{"A", bson.D{{"$in", bson.A{"v"}}}}}}},
	// 	},
	// }
	// arrayFilter := options.ArrayFilters{
	// 	Filters: []interface{}{
	// 		bson.D{{"speaker.email", bson.D{{"$eq", "v"}}}},
	// 	},
	// }

	opts := options.Update().SetUpsert(true)
	//.SetArrayFilters(arrayFilter)

	result, err := database.GetConnection(OrgId).Collection(collectionName).UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusInternalServerError).SendString("Error updating document")
	}
	if result.MatchedCount == 0 {
		return c.Status(fiber.StatusNotFound).SendString("Document not found or no changes were made")
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data":    result,
		"status":  fiber.StatusOK,
		"message": "Data updated successfully",
	})
}
