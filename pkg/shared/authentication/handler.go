package authentication

import (
	"context"
	"fmt"
	"os"
	"time"

	jwtware "github.com/golang-jwt/jwt/v4"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"v-dir/pkg/shared"
	"v-dir/pkg/shared/helper"
)

// To get the ctx for Global
var ctx = context.Background()

// LoginHandler - Method to Valid the user id and password Auth

func LoginHandler(c *fiber.Ctx) error {

	var tokenString string
	var LoginRequest LoginRequest
	var response LoginHandlerResponse
	var collectionName string
	if err := c.BodyParser(&LoginRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	filter := bson.M{
		"$or": []bson.M{
			{"email": LoginRequest.Id},
			{"phone": LoginRequest.Password},
		},
	}

	Company, _ := helper.FindOneDocument("vdir", "companies", filter)
	fmt.Println(Company)
	if Company == nil {
		var seeker map[string]interface{}
		seeker, _ = helper.FindOneDocument("vdir", "seekers_info", filter)
		if seeker == nil {
			return c.Status(fiber.StatusBadRequest).SendString("Invalid email or password")
		}

		if !helper.CheckPassword(LoginRequest.Password, primitive.Binary(seeker["password"].(primitive.Binary)).Data) {
			return c.Status(fiber.StatusBadRequest).SendString("Invalid email or password")
		}

		// err := SendOTP(c, LoginRequest.LoginID, "seekers_info")
		// if err != nil {
		// 	return err
		// }

		// You can customize the response here if OTP sending is successful
		// return c.JSON(fiber.Map{"status": "success", "message": "OTP sent to your email for verification"})
		collectionName = "seekers_info"
		claims := Claims(LoginRequest, collectionName, seeker)

		tokenString, _ = JwtToken(c, claims)
		response = LoginHandlerResponse{Token: tokenString}

	} else {
		if !helper.CheckPassword(LoginRequest.Password, primitive.Binary(Company["password"].(primitive.Binary)).Data) {
			return c.Status(fiber.StatusBadRequest).SendString("Invalid email or password")
		}

		// err := SendOTP(c, LoginRequest.LoginID, "companies")
		// if err != nil {
		// 	return err
		// }
		collectionName = "companies"
		claims := Claims(LoginRequest, collectionName, Company)
		// You can customize the response here if OTP sending is successful
		// return c.JSON(fiber.Map{"status": "success", "message": "OTP sent to your email for verification"})
		tokenString, _ = JwtToken(c, claims)
		response = LoginHandlerResponse{Token: tokenString}
	}

	return c.JSON(response)
}

func JwtToken(c *fiber.Ctx, claims jwtware.MapClaims) (string, error) {
	token := jwtware.NewWithClaims(jwtware.SigningMethodHS256, claims)

	var secret = os.Getenv("SECRETKEY")
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return tokenString, nil
}

func Claims(loginRequest LoginRequest, collectionName string, userData map[string]interface{}) jwtware.MapClaims {
	var claims jwtware.MapClaims
	fmt.Printf("Login Request: %+v\n", loginRequest)
	fmt.Printf("Collection Name: %s\n", collectionName)
	fmt.Println(userData, "userDAta")
	if collectionName == "companies" {

		claims = jwtware.MapClaims{
			"UserID":     loginRequest.Id,
			"name":       userData["Name"].(string),
			"unique_id":  userData["unique_id"].(string),
			"email":      userData["email"].(string),
			"role":       "Company",
			"Collection": "companies",
			"exp":        time.Now().Add(time.Minute * 30).Unix(), // Token expires in 30 minutes
		}
		fmt.Println(claims)
	} else if collectionName == "seekers_info" {

		claims = jwtware.MapClaims{
			"UserID":     loginRequest.Id,
			"email":      userData["email"].(string),
			"role":       "seeker",
			"Collection": "seekers_info",
			"unique_id":  userData["unique_id"].(string),
			"exp":        time.Now().Add(time.Minute * 30).Unix(), // Token expires in 30 minutes
		}
		fmt.Println(claims)
	}

	return claims
}

func OrgConfigHandler(c *fiber.Ctx) error {
	org, exists := helper.GetOrg(c)
	if !exists {
		//send error
		return shared.BadRequest("Org not found")
	}
	return shared.SuccessResponse(c, org)
}

func sendOtp(c *fiber.Ctx) error {

	recipent := c.Params("recipent")
	userType := c.Params("userType")

	err := helper.SendOTP(c, recipent, userType)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "OTP sent to this email " + recipent, "status": 200})
}

func ValidateOtp(c *fiber.Ctx) error {

	collectionName := c.Params("collectionName")
	// InsertcollectionName := collectionName
	reqData, err := parseRequestData(c)
	if err != nil {
		return err
	}

	pipeline := bson.A{
		bson.D{
			{"$match",
				bson.D{
					{"email", reqData.Id},
				},
			},
		},
	}
	userData, err := helper.GetAggregateQueryResult("vdir", collectionName, pipeline)
	if err != nil {
		c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "user Data not found"})
		return nil
	}

	if len(userData) > 0 {
		return helper.ProcessVerifiedOtp(c, collectionName, reqData, userData)
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No Account found", "status": 404})
}

func parseRequestData(c *fiber.Ctx) (helper.ValidateOtp, error) {
	var reqData helper.ValidateOtp
	err := c.BodyParser(&reqData)
	if err != nil {
		return reqData, nil
	}
	return reqData, nil
}
