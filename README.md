# API JSON format

## `GET http://example.com/api/products`

response:

```json
[
	{
		"id": 1,
		"name": "Test item",
		"description": "edited content",
		"price": 9000,
		"quantity": 8
	},
	{
		"id": 2,
		"name": "Test item",
		"description": "Lorem ipsum dolor",
		"price": 5,
		"quantity": 1
	},
	...
]
```

---

## `GET http://example.com/api/products/1`

response:

```json
{
	"id": 1,
	"name": "Test item",
	"description": "edited content",
	"price": 9000,
	"quantity": 8
}
```

---

## `POST http://example.com/api/products`

body:

```json
{
	"name": "Test item",
	"description": "Lorem ipsum",
	"price": 9000.0,
	"quantity": 1
}
```

response:

```json
{
	"id": 3,
	"name": "Test item",
	"description": "Lorem ipsum",
	"price": 9000,
	"quantity": 1
}
```

---

## `PATCH http://example.com/api/products/3`

body:

```json
{
	"quantity": 100
}
```

> any valid key/value pair set allowed

response:

```json
{
	"id": 3,
	"name": "Test item",
	"description": "Lorem ipsum",
	"price": 9000,
	"quantity": 100
}
```

---

## `DELETE http://example.com/api/products`

> Requires authorization

---

## `DELETE http://example.com/api/products/3`

---

## `POST http://example.com/api/register`

Authorization: Basic  
Username: testuser  
Password: test

response:

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNjQ2ODYxMzM5LCJleHAiOjE2NDY4NjQ5Mzl9.6HS8agRqRYC9zjW_QY3rYD9uwFStHYYW-OVK6FsAZv4",
	"username": "testuser"
}
```

---

## `POST http://example.com/api/login`

Authorization: Basic  
Username: testuser  
Password: test

response:

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNjQ2ODYxNTQxLCJleHAiOjE2NDY4NjUxNDF9.vMg3NoU64JCUZTLs2mpBELVaMmIFy85CCzgnp8sMu7E",
	"username": "testuser"
}
```

---

## `POST http://example.com/api/login`

Authorization: Bearer  
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNjQ2ODYxNTQxLCJleHAiOjE2NDY4NjUxNDF9.vMg3NoU64JCUZTLs2mpBELVaMmIFy85CCzgnp8sMu7E
