-- name: GetProduct :one
SELECT * FROM products
WHERE id = $1 LIMIT 1;

-- name: GetProducts :many
SELECT * FROM products 
ORDER BY name;

-- name: CreateProduct :one
INSERT INTO products(
    name,description,stock,price
) VALUES(
    $1,$2,$3,$4
) 
RETURNING *;

-- name: UpdateProduct :exec
UPDATE products 
    set name= $2,
    description= $3,
    stock= $4,
    price= $5
WHERE id = $1;

-- name: DeleteProduct :exec
DELETE FROM products
WHERE id = $1;



