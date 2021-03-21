FROM nginx
COPY ./ /usr/share/nginx/html/


RUN apt-get update -y
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup__11.x | bash -
RUN apt-get -y install nodejs
RUN npm install

RUN cd /usr/share/nginx/html/
RUN npm install --save express fs https body-parser multer mkdirp cors wolfram-alpha-api
RUN apt-get install -y python3.8 python3-pip
RUN pip3 install -r requirements.txt
