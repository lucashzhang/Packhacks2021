FROM nginx
COPY ./ /usr/share/nginx/html/

RUN snap install node
RUN cd /usr/share/nginx/html/
RUN npm install --save express fs https body-parser multer mkdirp cors wolfram-alpha-api

RUN apt-get update -y
RUN apt-get install -y python3.8 python3-pip
RUN pip3 install -r requirements.txt
