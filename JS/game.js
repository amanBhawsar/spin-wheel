//Hello World of Phaser = Basic Game = Single Scene in Spin & Win Game
// How to create the basic skeleton for the game -> Game Loop

let prizes_config = {
    count:12,
    prize_names : ["3000 Credits","35% Off","Hard Luck","70% OFF","Swagpack","100% OFF","Netflix","50% Off","Amazon Voucher","2 Extra Spin", "CB Tshirt","CB Book"]
}

let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    audio: {
        disableWebAudio: true,
    },
    backgroundColor: 0xffcc00,
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

let game = new Phaser.Game(config);

function preload(){
//    console.log("Preload");
//    console.log(this);
    //load objects, load some images
    this.load.image('background','Assets/back.jpg');
    this.load.image('wheel','Assets/wheel.png');
    this.load.image('pin','Assets/pin.png');
    this.load.image('stand','Assets/stand.png');
    this.load.spritesheet( 'button', 'Assets/button.png', { frameWidth: 500, frameHeight: 200 });
    this.load.audio('music', ['Assets/sound.mp3']);
    this.load.audio('clap', ['Assets/clap.mp3']);
    this.load.image('star','Assets/star.png');
}
function create(){
//    console.log("Create");
    let W = game.config.width;
    let H = game.config.height;
    let background = this.add.sprite(W/2,H/2,'background');
    background.setScale(0.17);
    let stand = this.add.sprite(W/2,H/2+250,'stand');
    stand.setScale(0.25);
    this.wheel = this.add.sprite(W/2,H/2,'wheel');
    this.wheel.setScale(0.25);
    let pin = this.add.sprite(W/2,30,'pin');
    pin.setScale(0.25);
    //use pin.depth(int) if you want one image to overlap on anather 
    
    //event listner for mouse click
//    this.input.on('pointerdown',spinwheel,this);
    
    font_style = {
        font : "bold 25px Arial",
        align: "center",
        color : "red",
    }
    this.game_text = this.add.text(10,25,"Welcome To Spinner ",font_style); 
    console.log(this.input);
    this.button = this.add.sprite(100, 500,'button').setInteractive();
    this.button.setScale(0.5);
    this.button.on('pointerover', function(){this.button.setTint(0xf0ff00);}, this)
    this.button.on('pointerout', function(){this.button.setTint(0xffffff);}, this)
    let abc = this;
    this.button.on('pointerdown', function(){
//        console.log(this);
        this.alpha = 0;
        spinwheel(abc);
    });
    this.spinSound = this.sound.add('music');
    this.clap = this.sound.add('clap');
    texture = this.textures.createCanvas('gradient', 10, 20);
    //  We can access the underlying Canvas context like this:
    grd = texture.context.createLinearGradient(0, 0, 0, 256);
    console.log(grd);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');

    texture.context.fillStyle = grd;
    texture.context.fillRect(0, 0, 16, 256);
}

function update(){
    console.log("In Update");
    
//    this.wheel.angle += 1;
//    this.wheel.scaleX += 0.001;
//    this.wheel.scaleY += 0.001;
}
var grd,texture;
function createTexture(sce){
    //  Call this if running under WebGL, or you'll see nothing change
    texture.refresh();
    sce.sound.play('clap');
    //  Add a bunch of images that all use the same texture
    for (var i = 0; i < 64; i++)
    {
        var image = sce.add.image(8 + i * 16, 0, 'gradient');

        sce.tweens.add({
            targets: image,
            y: 500,
            duration: 500,
            ease: 'fall',
            delay: i * 62.5,
            yoyo: true,
        });
    }

    sce.time.addEvent({ delay: 1000, callback: updateTexture, callbackScope: this, loop: false });
}

function updateTexture(){
    var grd = texture.context.createLinearGradient(0, 0, 0, 256);

    grd.addColorStop(0, generateHexColor());
    grd.addColorStop(1, generateHexColor());

    texture.context.fillStyle = grd;
    texture.context.fillRect(0, 0, 16, 256);

    //  Call this if running under WebGL, or you'll see nothing change
    texture.refresh();
}

function spinwheel(scene){
    console.log("Start Spinning");
    console.log(scene);
    scene.game_text.setText("Spinning Started, Good Luck!")
    
    //random angle
    let rounds = Math.round(Math.random()*3 + 2);
    let degree = Phaser.Math.Between(0,11)*30;
    let total_angle = 360*rounds + degree;
    let val = Math.round((degree+15)/30);
//    console.log(prizes_config.prize_names[12-val]);
    scene.sound.play('music');
    tween = scene.tweens.add({
        targets: scene.wheel,
        angle: total_angle,
        ease: "Cubic.easeOut",
        duration: 6300,
        onComplete: function(){
            scene.game_text.setText("You got " + prizes_config.prize_names[12-val]);
            scene.button.alpha = 1;
            createTexture(scene);
        },
    });
}

function generateHexColor ()
{
    return '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16);
}
