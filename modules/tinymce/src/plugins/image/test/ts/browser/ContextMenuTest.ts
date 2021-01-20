import { Keyboard, Keys, Waiter } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { TinyAssertions, TinyHooks, TinySelections, TinyUiActions } from '@ephox/mcagar';
import { SugarDocument } from '@ephox/sugar';

import Editor from 'tinymce/core/api/Editor';
import Plugin from 'tinymce/plugins/image/Plugin';
import Theme from 'tinymce/themes/silver/Theme';
import { pWaitForDialog, submitDialog } from '../module/Helpers';

describe('browser.tinymce.plugins.image.ContextMenuTest', () => {
  const hook = TinyHooks.bddSetup<Editor>({
    plugins: 'image',
    toolbar: 'image',
    indent: false,
    base_url: '/project/tinymce/js/tinymce',
    image_caption: true
  }, [ Plugin, Theme ], true);

  const pOpenContextMenu = async (editor: Editor, target: string) => {
    // Not sure why this is needed, but without the browser deselects the contextmenu target
    await Waiter.pWait(0);
    await TinyUiActions.pTriggerContextMenu(editor, target, '.tox-silver-sink [role="menuitem"]');
  };

  const pWaitForAndSubmitDialog = async (editor: Editor) => {
    await pWaitForDialog(editor);
    submitDialog(editor);
  };

  it('TBA: Opening context menus on a selected figure', async () => {
    const editor = hook.editor();
    editor.setContent('<figure class="image" contenteditable="false"><img src="image.png"><figcaption contenteditable="true">Caption</figcaption></figure><p>Second paragraph</p>', { format: 'raw' });
    // Note: A fake caret will be the first element in the dom
    TinySelections.setSelection(editor, [], 1, [], 2);
    await pOpenContextMenu(editor, 'figure.image');
    Keyboard.activeKeydown(SugarDocument.getDocument(), Keys.enter(), {});
    await pWaitForAndSubmitDialog(editor);
    TinyAssertions.assertSelection(editor, [], 0, [], 1);
  });

  it('TBA: Opening context menus on an unselected figure', async () => {
    const editor = hook.editor();
    editor.setContent('<figure class="image" contenteditable="false"><img src="image.png"><figcaption contenteditable="true">Caption</figcaption></figure><p>Second paragraph</p>', { format: 'raw' });
    // Note: A fake caret will be the first element in the dom
    TinySelections.setCursor(editor, [ 2, 0 ], 1);
    await pOpenContextMenu(editor, 'figure.image');
    Keyboard.activeKeydown(SugarDocument.getDocument(), Keys.enter(), {});
    await pWaitForAndSubmitDialog(editor);
    TinyAssertions.assertSelection(editor, [], 0, [], 1);
  });

  it('TBA: Opening context menus on a selected image', async () => {
    const editor = hook.editor();
    editor.setContent('<p><img src="image.png" /></p><p>Second paragraph</p>', { format: 'raw' });
    TinySelections.setSelection(editor, [ 0 ], 0, [ 0 ], 1);
    await pOpenContextMenu(editor, 'img');
    Keyboard.activeKeydown(SugarDocument.getDocument(), Keys.enter(), {});
    await pWaitForAndSubmitDialog(editor);
    TinyAssertions.assertSelection(editor, [ 0 ], 0, [ 0 ], 1);
  });

  it('TBA: Opening context menus on an unselected image', async () => {
    const editor = hook.editor();
    editor.setContent('<p><img src="image.png" /></p><p>Second paragraph</p>', { format: 'raw' });
    TinySelections.setSelection(editor, [ 1, 0 ], 1, [ 1, 0 ], 1);
    await pOpenContextMenu(editor, 'img');
    Keyboard.activeKeydown(SugarDocument.getDocument(), Keys.enter(), {});
    await pWaitForAndSubmitDialog(editor);
    TinyAssertions.assertSelection(editor, [ 0 ], 0, [ 0 ], 1);
  });
});
