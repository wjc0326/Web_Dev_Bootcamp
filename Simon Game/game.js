var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;

// Step 4 - Check which button is pressed
$(".btn").click(function() {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

$(document).keypress(function(){
  if (started === false){
    $("h1").text("Level " + level);
    nextSequence();
    started = true;
  }
});


function nextSequence() {

  // Once nextSequence() is triggered, reset the userClickedPattern to an empty array ready for the next level.
  userClickedPattern = [];

  level++;
  $("h1").text("Level " + level);

  // Step 2 - Create a new pattern using random number
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Step 3 - Show the sequence to the user with animations and sounds
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}


function checkAnswer(currentLevel){

  // Check if the most recent user answer is the same as the game pattern.
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]){

    // If the user got the most recent answer right in previous step,
    // then check if they have finished their sequence.
    if (userClickedPattern.length === gamePattern.length){
      setTimeout(function(){nextSequence();}, 1000);
    }
  }
  else{
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function(){
      $("body").removeClass("game-over");
    }, 200);
    $("h1").text("Game Over, Press Any Key to Restart");
    startOver();
  }
}


//*************** Helper functions ***************//

function startOver(){

  // Reset the variables
  level = 0;
  gamePattern = [];
  started = false;
}


function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}


function animatePress(currentColour) {
  $("." + currentColour).addClass("pressed");
  setTimeout(function() {
    $("." + currentColour).removeClass("pressed");
  }, 100);
}
