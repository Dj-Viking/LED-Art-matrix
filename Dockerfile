FROM node:16.14.2
WORKDIR /led-art-matrix
COPY . .
RUN apt-get update
RUN apt-get install -y sudo
RUN sudo apt-get upgrade -y
RUN sudo apt-get install vim -y
RUN npm install --verbose
CMD ["npm", "start"]

# build the image with a specific name in the current working directory of this dockerfile
# docker build -t my-image .

# run the image from a container in interactive mode using bash and selecting the name of the image to run the container on
# docker run -it --entrypoint=/bin/bash my-image