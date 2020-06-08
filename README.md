The project is currently being hosted on Netlify [here](https://pensive-bohr-6ca76f.netlify.app/) and utilizes Firebase's database, storage, and cloud functions for managing game state, assets, and large chunks of game logic respectively. Find out more about the board game on Horrible Guild's [official site](https://www.horribleguild.com/the-kings-dilemma/).

## Table of Contents
- [Available Scripts](#available-scripts)
  * [`npm start`](#-npm-start-)
  * [`npm run build`](#-npm-run-build-)
- [House Selection](#house-selection)
- [Quick Access Bar](#quick-access-bar)
- [Voting](#voting)
- [Secret Agenda Cards](#secret-agenda-cards)
- [Side Bar](#side-bar)
- [Uploading](#uploading)

## Available Scripts 
From [Create React App](https://github.com/facebook/create-react-app)

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## House Selection
The main page of the app features the five houses my friends and I are using to play. Hovering over each kingdom's crest displays their house motto. 

![House Selection](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/house_selection.png)
![House Hover](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/house_selection_hover.png)

## Quick Access Bar
Every House has access to a main navigation bar at the top which allows easy access to extras from the game. These include the game maps, lore, rules, and a legend for the symbols in the game. There is also a way to view the current chronicle stickers in play in the game. 


![Navbar](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/navbar.png)

One House has admin privileges and their top bar features a few extra buttons which allow for controlling the game state. These include stopping and starting voting, assigned agenda tokens, and ending the game. 
![Admin Extras](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/admin_extras.png)

## Voting
A key component to the game is the voting phase. The main voting page displays important information that each House will need in determining how they would like to vote. There are two tables displaying the Aye and Nay sides, which show who has voted and how much power they have committed. The center features the current card being voted on (Mr.Potato Head in this demo) allowing players to re-read the scenario. The Aye and Nay scales below the table show the tokens representing the potential outcomes of each side. Between the scales is the amount of power available to Houses who choose to pass and gather power. 

![Waiting](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/waiting.png)

On a House's turn all of the options available to them will be displayed and they can select their choice.

![vote_select](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/vote_turn.png)

Once a choice has been selected, the bottom banner will change to reflect the vote

![voted](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/voted.png)

If you get another turn in the voting phase the banner will update to allow you to commit more power to your vote if you choose.

![commit_more](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/commit_more.png)

Once the voting has finished the banner will display who won the vote and update the amount of power in the middle.

![vote done](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/vote_done.png)

The admin can now end the voting phase and everything will be reset and ready to go for the next dilemma!

## Secret Agenda Cards
At the beginning of the game players will be presented with a choice of the available secret agenda cards once it is their turn to select.

![secret agenda](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/secret_agenda.png)

Once they have selected a card the very bottom of their screen will display the needed information for that agenda card. They will be able to see how many points they get at the end of the game for having resources in the desired range, how rich they are in comparison to others, and a small image of the board with a shaded region showing the desired area for the resources to be. 

![agenda](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/agenda_display.png)

## Side Bar
The side bar displays important token information. It shows the current open agenda tokens assigned to each house as well as the current leader and moderator, which change houses during the game. Like the main menu, hovering over the house crests will display the house names. During the voting phase the houses will re-order themselves to display the voting turn order. At the very bottom the current coin and power amounts for your house are displayed. 

![sidebar](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/sidebar.png)

## Uploading
The current voting card changes throughout the game and the chronicle stickers may be updated as well. I have added an endpoint to be used by someone on their phone to take a photo of the card or stickers and upload it to Firebase. This allows for the dynamic nature of the game to be handled easily by whoever has the physical copy of the game. 

![photo upload](https://github.com/kaitlinthachuk/kings-dilemma/blob/master/images/photo_upload.png)
