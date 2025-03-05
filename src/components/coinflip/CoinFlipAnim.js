import { useEffect } from "react";

const CoinFlipAnim = () => {

    useEffect(() => {
        // window.onload = function () {
        console.log("loaded")
        var canvas = document.getElementById('coinflip-anim');
        var ctx = canvas.getContext('2d');
        canvas.width = 160;
        canvas.height = 160;
        canvas.style.backgroundColor = 'white';
        // ctx.fillStyle = 'white';
        let spriteFrame = 0

        class Flip {
            constructor() {
                this.image = document.getElementById('coinflip-image');
                this.spriteWidth = 80;
                this.spriteHeight = 200;
                this.width = this.spriteWidth;
                this.height = this.spriteHeight;
                this.x = 0;
                this.y = 0;
                this.minFrame = 0;
                this.maxFrame = 1;
                this.spriteFrame = -56;
            }

            draw(context) {
                context.drawImage(
                    this.image,
                    this.spriteFrame,
                    this.spriteFrame * this.spriteHeight,
                    // this.spriteWidth,
                    // this.spriteHeight,
                );
            }
        }

        const flip = new Flip();
        console.log(flip);

        const animate = () => {
            flip.draw(ctx);
        }

        animate();
    }, []);






    return (
        <div className="coinflip-anim absolute bg-red">
            <img id='coinflip-image' src='/coinflip.png' alt='coinflip' className="hidden" />
            <canvas id="coinflip-anim">s
            </canvas>
        </div>
    );
}

export default CoinFlipAnim;