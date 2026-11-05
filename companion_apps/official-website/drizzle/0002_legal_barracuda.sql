CREATE TABLE "service" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
