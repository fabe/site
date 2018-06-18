import React from 'react';
import * as PIXI from 'pixi.js';
import * as filters from 'pixi-filters';
import dmap from '~/src/utils/dmap3.jpg';
import headshot from '~/src/pages/fabian-schultz.jpg';

function background(bgSize, inputSprite, type, forceSize) {
  var sprite = inputSprite;
  var bgContainer = new PIXI.Container();
  var mask = new PIXI.Graphics()
    .beginFill(0x8bc5ff)
    .drawRect(0, 0, bgSize.x, bgSize.y)
    .endFill();
  bgContainer.mask = mask;
  bgContainer.addChild(mask);
  bgContainer.addChild(sprite);

  var sp = { x: sprite.width, y: sprite.height };
  if (forceSize) sp = forceSize;
  var winratio = bgSize.x / bgSize.y;
  var spratio = sp.x / sp.y;
  var scale = 1;
  var pos = new PIXI.Point(0, 0);
  if (type == 'cover' ? winratio > spratio : winratio < spratio) {
    //photo is wider than background
    scale = bgSize.x / sp.x;
    pos.y = -(sp.y * scale - bgSize.y) / 2;
  } else {
    //photo is taller than background
    scale = bgSize.y / sp.y;
    pos.x = -(sp.x * scale - bgSize.x) / 2;
  }

  sprite.scale = new PIXI.Point(scale, scale);
  sprite.position = pos;

  return bgContainer;
}

class Canvas extends React.Component {
  componentDidMount() {
    // Some PIXI setup.
    this.canvasHolder = this.scene;
    this.imgContainer = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(620, 700, {
      antialias: true,
      transparent: true,
      resolution: 2,
    });
    this.stage = new PIXI.Container();

    // Get assets/filters ready.
    this.bg = PIXI.Sprite.fromImage(headshot);
    this.displacementSprite = PIXI.Sprite.fromImage(dmap);
    this.displacementFilter = new PIXI.filters.DisplacementFilter(
      this.displacementSprite
    );

    // Some constants to work with.
    this.displayScale = 200;
    this.speed = 0.2;
    this.imgWidth = 1317;
    this.imgHeight = 1521;
    this.count = 0;

    // Bind `this` to animate().
    this.animate = this.animate.bind(this);

    this.init();
  }

  init() {
    // Append our renderer to the canvas.
    this.canvasHolder.appendChild(this.renderer.view);

    // Set input image anchor to the center of the image.
    this.bg.anchor.x = 0.5;
    this.bg.anchor.y = 0.5;

    this.displacementSprite.anchor.x = 0.25;
    this.displacementSprite.anchor.y = 0.25;

    // Add input image to PIXI container.
    this.imgContainer.addChild(this.bg);

    // Center container on input image.
    this.imgContainer.position.x = this.imgWidth / 2;
    this.imgContainer.position.y = this.imgHeight / 2;

    this.stage.scale.x = this.stage.scale.y = 600 / this.imgWidth;

    // Add all elements to our main stage.
    this.stage.addChild(this.imgContainer);
    this.stage.addChild(this.displacementSprite);

    // Make the renderer responsive.
    this.renderer.view.setAttribute('style', 'height:auto;width:100%;');

    // Call recursive animation.
    this.animate();
  }

  animate() {
    // Increase our count so things start to change.
    this.count = this.count + 0.05 * this.speed;

    // Change position of the displacement filter.
    // Using sin/cos to have a circular movement instead of moving out of the screen eventually.
    // this.displacementFilter.scale.x = Math.sin(this.count * 0.15) * 1000;
    // this.displacementFilter.scale.y = Math.cos(this.count * 0.13) * 1000;

    // Change up the position of sprite also.
    // this.displacementSprite.x += Math.sin(this.count * 0.15);
    // this.displacementSprite.y += Math.cos(this.count * 0.13);

    // Also change rotation. Get weird!
    this.displacementSprite.rotation = this.count * 0.1;

    // Add the changes to the stage filters.
    this.stage.filters = [this.displacementFilter];

    // Finally, render those changes.
    this.renderer.render(this.stage);

    // Animate again if the browser wants to.
    requestAnimationFrame(this.animate);
  }

  render() {
    return <div ref={scene => (this.scene = scene)} />;
  }
}

export default Canvas;
