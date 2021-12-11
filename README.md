# Phaser-CE Runtime Editor

A plugin that shows a runtime editor for your [Phaser-CE] game.

![Phaser Runtime Editor](./docs/full.webp?raw=true 'Phaser Runtime Editor')

## What can I do with it?

-   Select, move and scale objects inside the game
-   See and edit some basic properties for object in the scene
-   See the scene object tree
-   Zoom in and out the scene
-   Use a preview image to help you build your scene

## What can't I do with it?

-   Save the changes. This will never be possible since the Editor does't know what code generated the scene
-   Update the object tree in realtime. This is quite heavy to do. Might be something for the future.
-   Select multiple objects
-   Object rotation. It's pretty hard!

> The Editor was tested mostly on Google Chrome. So it might be different in other browsers.

## Installation

After you install [Phaser-CE], use npm to install Phaser Runtime Editor:

```sh
npm install -D @kleber-swf/phaser-runtime-editor
```

### The simplies setup

Inside your game, after the Phaser's Game instance is created, add it as a Phaser plugin:

```js
game.plugins.add(new Phaser.Plugin.RuntimeEditor(game));
```

This will make it available for you at runtime. You will notice a small icon at the top left corner of your game. Click on it to open the editor.

### Options

There are some options you can pass as an optional second parameter when creating the plugin:

```js
const config = {
	root() => game.world,
    referenceImageUrl() => 'http://some/preview/image.png',
    onShow() => console.log('reuntime editor opened'),
    onHide() => console.log('reuntime editor closed'),
    pauseGame: true,
    clearPreferences: false,
};

game.plugins.add(new Phaser.Plugin.RuntimeEditor(game, config));
```

The config object can have the following properties (all of them optional):

-   `root: () => PIXI.DisplayObjectContainer | Phaser.Stage`

    This method returns the container where the Editor will get its objects. You can pass, for example a method that returns a specific root element.

    This method is called every time the Editor is shown, so you can return a different root depending on something your game controls.

    Default: `() => game.world`.

-   `referenceImageUrl: (width: number, height: number, responsive: boolean) => string`

    If your workflow uses [reference images](#reference-image) to build the scenes in the game, you can use this method to get their urls to be used in the Editor.

    This method returns an url to an image file. It can be inside your project or not. It just need to be something you can put in a `src` attribute of a `<img>` tag. This method is called every time the game view is resized inside the editor.

    The method accepts three parameters:

    -   `width`: preview width
    -   `height`: preview height
    -   `responsive`: whether the editor is in responsive view mode

    You can use these parameter to determine which image you should return.

    Default: `() => null`.

-   `onShow: () => void`

    A method that is called right after the Editor is shown.

    Default: `null`.

-   `onHide: () => void`

    A method that is called right after the Editor is hidden.

    Default: `null`.

-   `pauseGame: boolean`

    Whether the Editor should pause your game on show or not. If this is set to `true` the game will come back to it's original state when the Editor is hidden.

    Default: `false`.

-   `clearPreferences: boolean`

    Whether the local preferences should be cleared when the Editor is shown.

    Default: `false`.

> Notice that there is an [example project] inside the Editor's project where you can see it in use.

## Features

### Object Tree

![Object Tree](./docs/object-tree.webp?raw=true 'Object Tree')

-   A tree view of the objects in the scene. It can't be updated at runtime.
-   It has a field where you can filter the objects by their names
-   It can expand and collapse its nodes (use alt + click to expand/collapse all of its children)
-   It has an icon for each type of object to make it easy to identify them
-   Dims invisible objects

### Properties Panel

![Properties Panel](./docs/properties.webp?raw=true 'Properties Panel')

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

![Scene View](./docs/scene-view.webp?raw=true 'Scene View')

-   It can visually select and edit properties from an object in the scene
-   It's possible to move and scale the selected object
-   When scaling, its possible to make it freely, proportially (holding `CTRL`), centered (holding `ALT`) or a combination of last two.
-   It shows the selected object pivot and anchor (if any)
-   The selection is made from the deepest children to its parent

### Reference Image

![Reference Image Options](./docs/reference-image.webp?raw=true 'Reference Image Options')

Its common to have a reference image made by the art team so the developer can make the game look like it was conceived.

To help you with this pipeline, the Editor has a reference image parameter (`referenceImageUrl`) inside the initial config that lets you tell what is the url for this image.

When you set this parameter to a valid image url, the reference image options panel is available in the Editor. These options are to adjust the image filters and opacity to make it easy to distinguish it from the real game.

### Actions

![Actions Toolbar](./docs/actions-toolbar.webp?raw=true 'Actions Toolbar')

1.  **Panels Toogle**. Toggles panel visibility to better view the game scene. It is available for both panels.

2.  **Editor**. Toggles the editor (its shown inside the game as a floating almost invisible button at the top left corner of the screen)

3.  **Snap**. Toggles the snapping to integer numbers when moving objects in the scene view

4.  **Guides**. Toggles guide lines around the selected object to better position it in the scene view

5.  **Gizmos**. Toggles gizmos visibility in scene view

6.  **Hit Area**. Toggles the hit area visibility of the selected object in the scene view

7.  **All Hit Areas Snapshot**. Shows a snapshot of all hit areas available in the scene view. It doesn't updated if objects change while it's being shown. Toggle it twice to update it.

8.  **Responsive Panel: Toggle**. Toggles responsive view and features. Responsive view is like the one seen on browsers. The other buttons are available when this option is selected.

9.  **Responsive Panel: Orientation Toggle** Change orientation of the responsive view

10. **Responsive Panel: Proportion Templates**: Some common proportions for mobile devices and the custom one, where you can resize the responsive view freely

11. **Zoom Out**. Zooms out the scene view

12. **Reset Zoom**. Resets the scene zoom to its default value

13. **Zoom In**. Zooms in the scene view

14. **Print Object to Console**. Prints the selected object into the console. This is useful for when you want to see some property that is not mapped into the properties panel

15. **Reference Image Panel: Toggle**. Toggles the reference image panel and the reference image inside the scene view

16. **Reference Image Panel: Options**. Shows the reference image options where you can set the opacity and filters of the reference image inside the scene view

17. **Undo**: Undo the last action (it has a limit of 100 actions)

18. **Help Screen**. Shows the help screen with the actions shortcuts and descriptions

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

## Development

-   Clone the project

    ```sh
    git clone git@github.com:kleber-swf/phaser-runtime-editor.git
    ```

-   Install dependencies

    ```sh
    npm install
    ```

-   Run the example project
    ```sh
    npm run dev
    ```

[phaser-ce]: https://github.com/photonstorm/phaser-ce
[example project]: https://github.com/kleber-swf/phaser-runtime-editor/tree/master/example
