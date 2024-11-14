CREATE TABLE "Bid" (
    "ID" CHAR(36) NOT NULL,
    "CustomerID" CHAR(36) NOT NULL,
    "Amount" DECIMAL(8, 2) NOT NULL,
    "TimeStamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "AuctionID" CHAR(36) NOT NULL,
    PRIMARY KEY("ID")
);

CREATE TABLE "Auction" (
    "ID" CHAR(36) NOT NULL,
    "ProductID" CHAR(36) NOT NULL,
    "StartTime" TIMESTAMP NOT NULL,
    "EndTime" TIMESTAMP NOT NULL,
    "StartPrice" DECIMAL(8, 2) NOT NULL,
    "EndPrice" DECIMAL(8, 2) NOT NULL,
    PRIMARY KEY("ID")
);

CREATE TABLE "Buyer" (
    "ID" CHAR(36) NOT NULL,
    "UserID" CHAR(36) NOT NULL,
    "Address" VARCHAR(1000) NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'active',
    PRIMARY KEY("ID")
);

CREATE TABLE "User" (
    "ID" CHAR(36) NOT NULL,
    "Email" VARCHAR(255) NOT NULL,
    "Username" VARCHAR(255) NOT NULL,
    "Password" VARCHAR(255) NOT NULL,
    "sessionID" CHAR(36),
    "Credits" INTEGER NOT NULL,
    "DateCreated" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("ID")
);

CREATE TABLE "Payment" (
    "ID" BIGSERIAL PRIMARY KEY,
    "UserID" CHAR(36) NOT NULL,
    "Shipping" VARCHAR(255) NOT NULL,
    "Amount" DECIMAL(8, 2) NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
    "ID" CHAR(36) NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Description" VARCHAR(255) NOT NULL,
    "Category" VARCHAR(255) NOT NULL,
    "SupplierID" CHAR(36) NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Price" DECIMAL(8, 2) NOT NULL,
    "Status" VARCHAR(255) NOT NULL,
    PRIMARY KEY("ID")
);

CREATE TABLE "Seller" (
    "ID" CHAR(36) NOT NULL,
    "UserID" CHAR(36) NOT NULL,
    "Address" VARCHAR(100) NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'active',
    PRIMARY KEY("ID")
);

-- Unique constraints
ALTER TABLE "Buyer" ADD CONSTRAINT "buyer_userid_unique" UNIQUE ("UserID");
ALTER TABLE "User" ADD CONSTRAINT "user_email_unique" UNIQUE ("Email");
ALTER TABLE "User" ADD CONSTRAINT "user_username_unique" UNIQUE ("Username");
ALTER TABLE "Seller" ADD CONSTRAINT "seller_userid_unique" UNIQUE ("UserID");

-- Foreign key constraints
ALTER TABLE "Bid" ADD CONSTRAINT "bid_auctionid_foreign" 
    FOREIGN KEY("AuctionID") REFERENCES "Auction"("ID");

ALTER TABLE "Auction" ADD CONSTRAINT "auction_productid_foreign" 
    FOREIGN KEY("ProductID") REFERENCES "Product"("ID");

ALTER TABLE "Product" ADD CONSTRAINT "product_supplierid_foreign" 
    FOREIGN KEY("SupplierID") REFERENCES "Seller"("ID");

ALTER TABLE "Payment" ADD CONSTRAINT "payment_userid_foreign" 
    FOREIGN KEY("UserID") REFERENCES "User"("ID");

ALTER TABLE "Buyer" ADD CONSTRAINT "buyer_userid_foreign" 
    FOREIGN KEY("UserID") REFERENCES "User"("ID");

ALTER TABLE "Seller" ADD CONSTRAINT "seller_userid_foreign" 
    FOREIGN KEY("UserID") REFERENCES "User"("ID");

ALTER TABLE "Bid" ADD CONSTRAINT "bid_customerid_foreign" 
    FOREIGN KEY("CustomerID") REFERENCES "Buyer"("ID");