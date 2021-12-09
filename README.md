# Phaser-CE Runtime Editor

A [Phaser-CE] plugin that shows a runtime editor for your game:

## What it can do?

-   Select, move and scale objects inside the game
-   Show and edit some basic properties for the selected object

## What it can't do (yet)?

-   Save the changes. This will never be possible since the plugin does't know what code generated the scene
-   Update the object tree in realtime. This is quite heavy to do. Might be something for the future.
-   Select multiple objects
-   Object rotation. It's pretty hard!

## Installation

After you install [Phaser-CE], use npm to install this plugin:

```bash
npm install -D @kleber-swf/phaser-runtime-editor
```

### The simplies setup

Inside your game, after the Phaser's Game instance is created, add the plugin:

```js
game.plugins.add(new Phaser.Plugin.RuntimeEditor(game));
```

This will make it available for you at runtime. You will notice a small icon at the top left corner of your game. Click on it to open the editor.

### Options

There are some options you can pass as an optional second parameter when creating the plugin:

```js
const referenceImage = new Phaser.Image(game, 0, 0, 'reference-image'),

const config = {
	root: () => game.world,
    refImage:() => referenceImage,
    onShow: () => console.log('reuntime editor opened'),
    onHide: () => console.log('reuntime editor closed'),
    pauseGame: true,
    clearPrefs: false,
};

game.plugins.add(new Phaser.Plugin.RuntimeEditor(game, config));
```

The config object can have the following properties (all of them optional):

-   `root()`: a method that returns a `PIXI.DisplayObjectContainer` or a `Phaser.Stage` where the plugin will get its objects. You can pass, for example a method that returns a specific root element. This method is called every time the plugin is shown, so you can return a different root depending on something your game controls. Default: `() => game.world`.
-   `refImage()`: a method that returns an `Phaser.Image` or a `Phaser.Sprite` to be used as a [reference image](#reference-image). Like `root()`, it's a method, so you can control which reference image the plugin will get based on your game. Default: `null`.
-   `onShow()`: a method that is called right after the plugin is shown. Default: `null`.
-   `onHide()`: a method that is called right after the plugin is hidden. Default: `null`.
-   `pauseGame`: whether the plugin should pause your game on show or not. If this is set to `true` the game will come back to it's original state when the plugin is hidden. Default: `false`.
-   `clearPrefs`: whether the local preferences should be cleared when the plugin is shown. Default: `false`.

> Notice that there is an [example project] inside the plugin's project where you can see it in use.

## Features

### Object Tree

-   A tree view of the objects in the scene. It can't be updated at runtime.
-   It has a filter where you can filter the objects by their names
-   It can expand and collapse its nodes (use alt + click to expand/collapse all of its children)
-   It has an icon for each type of object to make it easy to identify them
-   Dims invisible objects

### Properties Panel

-   Shows some basic properties of the selected object in the scene
-   Most of the properties are editable (and updated in the object)
-   Supported types:
    -   `number`
    -   `boolean`
    -   `string`
    -   `multiline text`
    -   `PIXI.Point`
    -   `PIXI.Rectangle`
    -   Color string
    -   Enums
-   The properties shown are based on the type of the selected object and are grouped by category
-   A handful copy button for each property copies it in JSON format

### Scene View

-   It can visually select and edit properties from an object in the scene
-   It's possible to move and scale the selected object
-   When scaling, its possible to make it freely, proportially (holding `CTRL`), centered (holding `ALT`) or a combination of last two.
-   It shows the selected object pivot and anchor (if any)
-   The selection is made from the deepest children to its parent

### Reference Image

Its common to have a reference image made by the art team so the developer can make it look like it was conceived. This feature helps you to see this reference image and sets its opacity so you can build the scene using it.

### Actions

-   Toggles the editor (its shown inside the game as a floating almost invisible button at the top left corner of the screen)
-   Scene view: toggle the snapping to integer numbers when moving objects in the scene
-   Scene view: toggle a handful guide around the selected object to better position it
-   Scene view: toggle gizmos visibility
-   Scene view: toggles the hit area visibility of the selected object
-   Scene view: shows a snapshot of all hit areas available in the scene. It doesn't updated if objects change while it's being shown. Toggle it twice to update it.
-   Scene view: responsive panel:
    -   Toggles responsive view and features. Responsive view is like the one seen on browsers. The other buttons are available when this option is selected.
    -   Change orientation of the responsive view
    -   Some common proportions for mobile devices and the custom one, where you can resize the responsive view freely
-   Scene view: zoom panel:
    -   Zoom out
    -   Reset zoom
    -   Zoom in
-   Prints the selected object into the console. This is useful for when you want to see some property that is not mapped into the properties panel
-   Undo: undo the last action (it has a limit of 100 actions)
-   Help screen with the actions shortcuts and descriptions
-   Reference image panel:
    -   Toggles the reference panel and the reference image
    -   Sets the reference image opacity
-   Panels: toggles panel visibility to better view the game scene. It is available for both panels.

### Misc

-   The editor saves some preferences locally, like panels size and visibility and options selected to make you life easy when running it consecutively

### Keyboard shortcuts

-   Scene:

    -   `ctrl+z`: undo the last action made
    -   `ctrl+shift+p`: prints the selected object to the console
    -   `escape`: clears the selection
    -   ` ctrl+\`` or  `ctrl+.`: toggle gizmos
    -   `⬆`: move selected object up by 1px
    -   `⬇`: move selected object down by 1px
    -   `⬅`: move selected object left by 1px
    -   `➡`: move selected object right by 1px
    -   `shift+⬆`: move selected object up by 10px
    -   `shift+⬇`: move selected object down by 10px
    -   `shift+⬅`: move selected object left by 10px
    -   `shift+➡`: move selected object right by 10px

-   View:

    -   `ctrl+wheel`: zoom
    -   `ctrl+=` or `ctrl++`: zoom in
    -   `ctrl+-`: zoom out
    -   `ctrl+0`: reset zoom to default
    -   `ctrl+[`: toggle left panel visibility
    -   `ctrl+]`: toggle right panel visibility

-   Object tree:

    -   `alt+click` on a node: collapses/expands the node children recursively

[phaser-ce]: https://github.com/photonstorm/phaser-ce
[example project]: https://github.com/kleber-swf/phaser-runtime-editor/tree/master/example
