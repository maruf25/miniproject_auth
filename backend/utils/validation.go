package utils

import (
	"strings"

	"github.com/go-playground/validator/v10"
)

func NoSpaces(fl validator.FieldLevel) bool {
	value := fl.Field().String()
	return !strings.Contains(value, " ")
}
