let BlackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'isHit': false,
    'turnsOver': false,
    'betplace': false,
};

const YOU = BlackjackGame['you'];
const DEALER = BlackjackGame['dealer'];

const hitSound = new Audio('https://github.com/Mrn28/mypic/blob/main/project2/sounds/swish.m4a?raw=true');
const winSound = new Audio('https://github.com/Mrn28/mypic/blob/main/project2/sounds/cash.mp3?raw=true');
const lossSound = new Audio('https://github.com/Mrn28/mypic/blob/main/project2/sounds/aww.mp3?raw=true');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#place-bet').addEventListener('click', blackjackBet);

var sum = document.querySelector('#sum').textContent;
var amount = document.querySelector('#bet-value').textContent;

sum = parseInt(sum);
amount = parseInt(amount);

var plasare = document.querySelector('#valid').textContent;

function blackjackBet() {
    if (BlackjackGame['betplace'] === false) {

        if (sum > 0) {
            var bet = prompt("Baga banu gros");
            if (bet <= sum) {
                sum = sum - bet;
                document.querySelector('#sum').textContent = sum;
                amount = amount + bet;
                amount = parseInt(amount);
                document.querySelector('#bet-value').textContent = amount;
            }
            else
                window.alert("Nu aveti credite destule! :(")
        }
        else {
            window.alert("Ai ramas fara credite! :(");
        }
        if (amount > 0) {
            plasare = "Pariu plasat!";
            document.querySelector('#valid').textContent = plasare;
            BlackjackGame['betplace'] = true;
        }
    }
}
function blackjackHit() {

    if (BlackjackGame['isStand'] === false) {
        BlackjackGame['betplace'] = true;

        if (amount == 0) {
            plasare = "Joc fara miza.";
            document.querySelector('#valid').textContent = plasare;
        }

        let card = randomCard();
        console.log(card);
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
        BlackjackGame['isHit'] = true;

        if (YOU['score'] > 21) {
            BlackjackGame['turnsOver'] = true;
            let winner = computeWinner();
            showResult(winner);
            BlackjackGame['isStand'] = true;
            BlackjackGame['isHit'] = false;
        }
    }


}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return BlackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `https://raw.githubusercontent.com/Mrn28/mypic/main/project2/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    if (BlackjackGame['turnsOver'] === true) {

        BlackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Sa ne jucam!";
        document.querySelector('#blackjack-result').style.color = "black";

        BlackjackGame['turnsOver'] = true;
        BlackjackGame['isHit'] = false;

        BlackjackGame['betplace'] = false;

        plasare = "Va rugam, plasati un pariu";
        document.querySelector('#valid').textContent = plasare;
    }
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        // If adding 11 keeps me below 21, add 11. Otherwise, add 1.
        if (activePlayer['score'] + BlackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += BlackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += BlackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += BlackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {


    if (BlackjackGame['isHit'] === true) {
        BlackjackGame['isStand'] = true;
        while (DEALER['score'] < 17 && BlackjackGame['isStand'] === true) {
            let card = randomCard();
            showCard(card, DEALER);
            updateScore(card, DEALER);
            showScore(DEALER);
            await sleep(1000);
        }
        BlackjackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);
        BlackjackGame['isHit'] = false;
    }
}

// compute winner and return who just won
// update the wins, draws and losses
function computeWinner() {
    let winner = 0;
    if (YOU['score'] <= 21) {
        // condition: higher score than dealer or when dealer busts but you're 21 or under
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            BlackjackGame['wins']++;
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {
            BlackjackGame['losses']++;
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']) {

            BlackjackGame['draws']++;
        }

        // condition when user busts but dealer doesn't
    } else {
        BlackjackGame['losses']++;
        winner = DEALER;
    }

    console.log(winner);

    return winner;
}

function showResult(winner) {
    let message, messageColor;
    // console.log(amount);

    if (BlackjackGame['turnsOver'] === true) {

        if (winner === YOU && amount != 0) {
            plasare = "Felicitari! Ati castigat ";
            document.querySelector('#valid').textContent = plasare + 2 * amount + "₿.";


            sum = sum + 2 * amount;
            document.querySelector('#sum').textContent = sum;
            document.querySelector('#wins').textContent = BlackjackGame['wins'];

            message = 'You won!';
            messageColor = 'green';
            winSound.play();



        } else if (winner === DEALER && amount != 0) {
            plasare = "Ne pare rau. Ati pierdut.";
            document.querySelector('#valid').textContent = plasare;

            document.querySelector('#losses').textContent = BlackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();

        } else if (amount != 0) {
            plasare = "Egalitate. Ati recuperat suma pariata.";
            document.querySelector('#valid').textContent = plasare;
            sum = sum + amount;
            document.querySelector('#sum').textContent = sum;

            document.querySelector('#draws').textContent = BlackjackGame['draws'];
            message = 'You drew!';
            messageColor = 'black';
        }

        amount = 0;
        document.querySelector('#bet-value').textContent = amount;

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}