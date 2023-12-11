package authentication

import (
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	//without JWT Token validation (without auth)
	auth := app.Group("/auth")
	// auth.Get("/", func(c *fiber.Ctx) error {
	// 	return c.SendString("Auth APIs")
	// })

	auth.Post("/login", LoginHandler)
	auth.Get("/config", OrgConfigHandler)

	app.Post("/validate-otp/:collectionName", ValidateOtp)
	app.Post("/send-otp/:recipent/:userType", sendOtp)
	// auth.Use(utils.JWTMiddleware())
	// Restricted Routes
	// app.Post("/reset-password/:collectionName", ResetPasswordHandler)

}
