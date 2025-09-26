//new XMLHttpRequest(); creates a new HTTP message to send to the backend
//message = request

const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
    console.log(xhr.response);
})

//Type of message we want to send and the URL we are sending it to
xhr.open('GET', 'https://supersimplebackend.dev');

//Sending the message
xhr.send();