const gridContainer = document.querySelector(".game");
let card1;
let card2;
let lockBoard = false;
let cards=[];
let correctlyMatchedCards =0;
//https://www.youtube.com/watch?v=dqqxkrKhfS4&ab_channel=CodingArtist
// function cardDeck() {
//     const values = [ "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", ];
//     const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
//     const cards = [];
//     for (let suit = 0; suit < suits.length; suit++) {
//         for (let val = 0; val < values.length; val++) {
//             const value = values[val];
//             const suit = suits[suit];
//             cards.push(value, suit);
//             //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push#:~:text=The%20push()%20method%20adds,new%20length%20of%20the%20array
//             //did not know how to add it to the end of the array afterwards.
            
//         }
//     }
//     return cards;
//     //console.log(cardDeck()); just for verification. 
// } first iteration of generating random cards, but wanted to use more specific things that we learned in class.
// const deck = cardDeck();
// function generateCard(deck) {
//     //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor#:~:text=The%20Math.floor()%20static,equal%20to%20a%20given%20number.
//     //https://www.w3schools.com/js/js_random.asp
//     //One website helped me get to Math.random() to be able to make as many cards as I need, but since JS doesn't have integers, I had to learn how to use Math.floor() to round down, just like (int)(Math.random() * someNumber)
//     const randomCard = Math.floor(Math.random() * 52);
//     const cardVal = cards[randomCard].value;
//     const cardSuit = cards[randomCard].suits;
// } part of the first iteration of generating cards.

fetch("scripts/cards.json")
  .then((res) => res.json()) // turns the code from cards.json from json code into js code to be interpreted
  .then((data) => {
    cards = [...data, ...data]; //puts all the cards from json into js into my cards array.
    //This was all done with the help of other people like my dad who specializes in this stuff, online sources, and YouTube videos. freeCodeCamp.org and Clever Programmer are two in specific. 
    shuffle();
    createCards(); //shuffle and generate the cards.
    }
); 
function shuffle() {
    let index = cards.length;
    let random;
    let tempVal;
    while (index !== 0) { 
      random = Math.floor(Math.random() * index);
      index--;
      tempVal = cards[index];
      cards[index] = cards[random];
      cards[random] = tempVal;
    }
} // Fisher-Yates Algorithm for shuffling cards.

function createCards() {
    let card;
    for (card of cards) {
      const cardEle = document.createElement("div");
      cardEle.classList.add("card");
      cardEle.setAttribute("data-name", card.name);
      cardEle.innerHTML = 
        `<div class="front"><img class="front-image" src=${card.image} /></div>
        <div class = "back"> </div>`;
        
      gridContainer.appendChild(cardEle);
      cardEle.addEventListener("click", flip); // allows cards to be clicked and flipped
    }
} //https://marina-ferreira.github.io/projects/js/memory-game/ 

function cardReset() {
    lockBoard = false;
    card1 = null;
    card2 = null;
}

function restart() {
    correctlyMatchedCards=0;
    gridContainer.innerHTML = "";
    createCards();
    cardReset();
    shuffle();
}

function flip() {
    if (lockBoard) return;
    if (this === card1) return;
    this.classList.add("flipped"); //add the cards that are flipped to be considered 'flipped'
    if (!card1) {
        card1=this; 
        return;
    }
    card2 = this;
    match();
}

function disableMatched() {
    card1.removeEventListener('click', flip);
    card2.removeEventListener('click', flip);
    correctlyMatchedCards++;
    cardReset();
}

function match() {
    let match = card1.dataset.name === card2.dataset.name;
    match ? disableMatched() : unflip(); // assigns "match" to the functions disableMatched() and unflip()
    //https://www.w3schools.com/jsref/jsref_operators.asp
}


function unflip() {
    setTimeout(() => {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    cardReset()}, 200); // less than 350 seems reasonable.
}

if (correctlyMatchedCards===52) {
    if (window.confirm("Congrats! You matched all the cards! To play again, hit OK")) {
        restart();
    }
    else {
        alert("Thanks for playing!");
    } //https://www.w3schools.com/js/js_popup.asp
}