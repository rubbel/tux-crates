//Show / Hide title view
var viewTitle = document.querySelector("#title-view");
document.querySelector("#start-btn").addEventListener ('click', function () {
	viewTitle.classList.remove('move-up');
    viewTitle.classList.add('move-down');
});
document.querySelector("#restart-btn").addEventListener ('click', function () {
    viewTitle.classList.remove('move-up');
    viewTitle.classList.add('move-down');
});
var btnClose = document.querySelector("#close-btn");
btnClose.addEventListener ('click', function () {
    viewTitle.classList.remove('move-down');
    viewTitle.classList.add('move-up');
});
//Game contollers
document.querySelector("#next-btn").addEventListener ('click', function () {
	Crates.levelUp();	
});
document.querySelector("#prev-btn").addEventListener ('click', function () {
	Crates.levelDown();	
});
document.querySelector("#undo-btn").addEventListener ('click', function () {
	Crates.undoMove();	
});
document.querySelector("#redo-btn").addEventListener ('click', function () {
	Crates.initLevel();	
});
