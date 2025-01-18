##1. Clone the Repository
Clone the repository to your local machine:

git clone https://github.com/ninja-hatori-dev/argenie

##2. Install Dependencies
Install the required dependencies:

npm install
##3. Configure Environment Variables
Create a .env file in the root of the project and set the following environment variables:

DATABASE_URL=from docker-compose.yaml


POSTGRES_USER=from docker-compose.yaml
POSTGRES_PASSWORD= from docker-compose.yaml
POSTGRES_DB= from docker-compose.yaml

 Port=from docker-compose.yaml
 JWT_SECRET=your_jwt_secret_key
 Node_env=development or 'production'based on your environment


##4. Setup Database

Run the Docker Compose Command:
docker-compose up

##5. Run the Application

ts-node app.ts
