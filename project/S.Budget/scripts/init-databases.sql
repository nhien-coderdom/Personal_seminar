-- Create databases for each microservice
CREATE DATABASE auth_db;
CREATE DATABASE transaction_db;
CREATE DATABASE insight_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE auth_db TO sbudget;
GRANT ALL PRIVILEGES ON DATABASE transaction_db TO sbudget;
GRANT ALL PRIVILEGES ON DATABASE insight_db TO sbudget;
