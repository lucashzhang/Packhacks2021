# PackHacks2021 - Alpha Stack
We designed a functional website to serve as a educational resource for college students. The site acts as an online tutoring platform where students can come to get assistance on any educational topic. We implement Machine Learning and the WolframAlpha API to give students a bot that can answer simple questions. If the bot cannot answer the questions, students public ask their peers and online tutors for assistance.
## Getting started
To use the site, just visit [alphastacks.aszala.com](alphastacks.aszala,com). To run on your own server, simple run ``node index.js`` in the server folder. Be sure to edit the location of the SSL certification.

## Technologies Used
The front-end of our website is built using HTML, CSS, and JavaScript / jQuery. Our backend was built in Node.JS and Python. Our Machine Learning model is built in Python and makes use of the WolframAlpha API. Our image-to-text system was built using Python and Google's Tesseract OCR engine. We also tried to publicly deploy our app on the Google Cloud Platform using Docker and Kubernetes. We use Google Firebase for our user authentication service and database.
## Inspiration
College is hard. Advanced classes in difficult subjects are very challenging and often we find ourselves needing to ask help. Getting quick and easy help is often a struggle as there is usually a large line or you have to make appointments way in advance. Especially now with the COVID-19 pandemic, it has become increasing harder to find quick and easy help. We wanted to make something that could not only solve this issue, but create a lasting community for people to belong to.

## Challenges we ran into
When training our pytorch subject text classifier, we ran into the problem of overtraining, such that our model would only fit on the specific sentences we provided on the data and not general sentences. To solve this, we had to lower our step size and increase our regularization constant such that our model would train to be more general, despite the small data set we used to train it on.
Another challenge was connecting python to the node.js server, which allows us to run our two models (Our Text Classifier Deep Neural Network, and Prabhakar Gupta's Tesseract OCR image2text model) in python on the backend; thus, a lot of debugging had to be done here for a proper user to server and server to user connection.
The worst problem would be CSS.

## Accomplishments that we're proud of
We are proud that we were able to successfully bring our idea to life during the span of the hackathon. We are also proud of all that we learned and the new experiences we gained. We got a chance to experiment with all kinds of new technology like the Google Tesseract OCR engine so we are proud that we were able to learn how to use them.

Training our own text subject classifier model was also extremely challenging, but also rewarding. We utilized the Pytorch python library, given a dataset of words and labels(subject). We trained our classifier was significantly overtraining on the data since our dataset was so small. Thus, we increased our regularization constant and slightly decreased our step size, such that the small batch sizes wouldnt overfit. As a result, we are able to classify the subject of the user's question.

## What we learned
We learned a lot more about web development and building fast and scalable applications with Google Cloud and Docker/Kubernetes as well as fast and scalable databases with Google Firebase. We learned how to integrate ML models into a Node.JS backend server as well as how to use the Google Tesseract OCR engine. We also learned how to use the WolframAlpha API for the first time.
## What's next for Alpha Stack
In the future we want to implement a more categorical base to the forums. Students should be able to focus their questions into certain categories so they can get assistance from someone who knows that subject matter faster. We would also like to improve our 'Spud' bot to be even more useful than it already is. Including searching through past students questions so even if the bot does not know the answer it can give you the same assistance that a previous student had when they encountered the issue. A final improvement would be a more successful deployment of our Docker file onto Kubernetes.

## Citations
Prabhakar Gupta - https://github.com/prabhakar267/image2text
