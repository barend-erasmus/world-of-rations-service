export let swaggerDocument = {
  "swagger": "2.0",
  "info": {
    "description": "World of Rations API",
    "version": "1.0.0",
    "title": "World of Rations API",
    "termsOfService": "http://swagger.io/terms/",
    "contact": {
      "email": "developersworkspace@gmail.com"
    },
    "license": {
      "name": "MIT",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "host": "worldofrations.com",
  "basePath": "/api",
  "tags": [
    {
      "name": "auth",
      "description": "Auth Route"
    },
    {
      "name": "feedstuff",
      "description": "Feedstuff Route"
    },
    {
      "name": "formula",
      "description": "Formula Route"
    },
    {
      "name": "formulator",
      "description": "Formulator Route"
    }
  ],
  "schemes": [
    "https"
  ],
  "paths": {
    "/auth/verify": {
      "get": {
        "tags": [
          "auth"
        ],
        "summary": "Retrieve user",
        "description": "",
        "operationId": "authverify",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "JWT",
            "type": "string"
          }
        ],
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/User"
            }
          },
          "401": {
            "description": "Invalid JWT"
          }
        }
      }
    },
    "/auth/google": {
      "get": {
        "tags": [
          "auth"
        ],
        "summary": "Redirects to Google OAuth2",
        "description": "",
        "operationId": "authgoogle",
        "responses": {
          "302": {
            "description": "Redirects to Google OAuth2"
          }
        }
      }
    },
    "/auth/google/callback": {
      "get": {
        "tags": [
          "auth"
        ],
        "summary": "Redirects to Web with JWT",
        "description": "",
        "operationId": "authgooglecallback",
        "parameters": [
          {
            "name": "code",
            "in": "query",
            "description": "Authentication Code",
            "type": "string"
          }
        ],
        "responses": {
          "302": {
            "description": "Redirect to Web with JWT"
          },
          "400": {
            "description": "Failed to validate"
          }
        }
      }
    },
    "/formula/listFormulas": {
      "get": {
        "tags": [
          "formula"
        ],
        "summary": "Retrieve list of formulas",
        "description": "",
        "operationId": "formulalistformulas",
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "items": {
                "$ref": "#/definitions/Formula"
              }
            }
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/formula/listFormulaTreeNodes": {
      "get": {
        "tags": [
          "formula"
        ],
        "summary": "Retrieve list of formula tree nodes",
        "description": "",
        "operationId": "formulalistformulatreenodes",
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "items": {
                "$ref": "#/definitions/TreeNode"
              }
            }
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/feedstuff/listFeedstuffs": {
      "get": {
        "tags": [
          "feedstuff"
        ],
        "summary": "Retrieve list of feedstuffs",
        "description": "",
        "operationId": "feedstufflistfeedstuffs",
        "parameters": [
          {
            "name": "code",
            "in": "query",
            "description": "Authentication Code",
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "items": {
                "$ref": "#/definitions/Feedstuff"
              }
            }
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/feedstuff/listUserFeedstuffs": {
      "get": {
        "tags": [
          "feedstuff"
        ],
        "summary": "Retrieve list of user feedstuffs",
        "description": "",
        "operationId": "feedstufflistuserfeedstuffs",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "JWT",
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "items": {
                "$ref": "#/definitions/Feedstuff"
              }
            }
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/feedstuff/findUserFeedstuff": {
      "get": {
        "tags": [
          "feedstuff"
        ],
        "summary": "Retrieve user feedstuff",
        "description": "",
        "operationId": "feedstufffinduserfeedstuff",
        "parameters": [
          {
            "name": "feedstuffId",
            "in": "query",
            "description": "Feedstuff Id",
            "type": "string"
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "JWT",
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/Feedstuff"
            }
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    }
  },
  "definitions": {
    "User": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "example": "demousername"
        },
        "aud": {
          "type": "string",
          "example": "worldofrations.com"
        },
        "exp": {
          "type": "integer",
          "format": "int64",
          "example": 1496647838
        },
        "iat": {
          "type": "integer",
          "format": "int64",
          "example": 1496644238
        },
        "iss": {
          "type": "string",
          "example": "worldofrations.com"
        },
        "jti": {
          "type": "string",
          "example": "02669616-afe6-4bd7-913e-b336288245a3"
        }
      }
    },
    "Formula": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "group": {
          "$ref": "#/definitions/FormulaGroup"
        },
        "elements": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FormulaElement"
          }
        },
        "comparisonFormulaId": {
          "type": "string"
        }
      }
    },
    "FormulaGroup": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "parent": {
          "$ref": "#/definitions/FormulaGroup"
        }
      }
    },
    "FormulaElement": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "unit": {
          "type": "string"
        },
        "code": {
          "type": "string"
        },
        "sortOrder": {
          "type": "integer",
          "format": "int64"
        },
        "minimum": {
          "type": "integer",
          "format": "int64"
        },
        "maximum": {
          "type": "integer",
          "format": "int64"
        }
      }
    },
    "TreeNode": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "children": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TreeNode"
          }
        }
      }
    },
    "Feedstuff": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "group": {
          "$ref": "#/definitions/FeedstuffGroup"
        },
        "elements": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FeedstuffElement"
          }
        },
        "username": {
          "type": "string"
        }
      }
    },
    "FeedstuffGroup": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      }
    },
    "FeedstuffElement": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "unit": {
          "type": "string"
        },
        "code": {
          "type": "string"
        },
        "sortOrder": {
          "type": "integer",
          "format": "int64"
        },
        "value": {
          "type": "integer",
          "format": "int64"
        }
      }
    }
  }
};