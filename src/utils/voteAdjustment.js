export default function voteAdjustment(
  buttonPressed,
  alreadyVoted,
  previousVoted
) {
  console.log(
    "buttonPressed",
    buttonPressed,
    "alreadyVoted",
    alreadyVoted,
    "previousVoted",
    previousVoted
  );
  let adjust = 1;
  if (buttonPressed === "dislike-button") adjust = -1;
  if (alreadyVoted) {
    adjust = -1;
    if (buttonPressed === "dislike-button") adjust = 1;
  }
  if (previousVoted && buttonPressed !== previousVoted) {
    const oppositeButton = document.getElementById(previousVoted); //needs changing for comments
    oppositeButton.classList.remove("voted");
    adjust = adjust === 1 ? 2 : -2;
  }
  return adjust;
}
