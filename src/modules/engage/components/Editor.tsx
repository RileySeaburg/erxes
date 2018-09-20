import { EditorState, Modifier } from 'draft-js';
import { Editor as CommonEditor } from 'modules/common/components';
import { EMAIL_CONTENT_KEYS_FOR_SELECT } from 'modules/engage/constants';
import React, { Component } from 'react';

const { ErxesEditor, toHTML, createStateFromHTML } = CommonEditor;

type Props = {
  editorState: any;
  onEditorStateChange: any;
};

const DynamicContent = ({ onEditorStateChange, editorState } : Props) => {
  const onChange = e => {
    const value = e.target.value;

    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    // insert new text to content state
    const contentState = Modifier.insertText(currentContent, selection, value);

    // update editor state
    onEditorStateChange(EditorState.push(editorState, contentState, 'adjust-depth'));
  };

  // render options
  const renderOptions = (options, groupValue, groupIndex) => {
    return options.map((option, optionIndex) => {
      return (
        <option
          value={`{{ ${groupValue}.${option.value} }}`}
          key={`optgroup-${groupIndex}-${optionIndex}`}
        >
          {option.text}
        </option>
      );
    });
  };

  // render opt groups
  const renderOptgroups = (group, options, index) => {
    return (
      <optgroup label={group.text} key={`optgroup-${index}`}>
        {renderOptions(options, group.value, index)}
      </optgroup>
    );
  };

  return (
    <select onChange={onChange}>
      <option>Attributes</option>

      {EMAIL_CONTENT_KEYS_FOR_SELECT.map(({ group, options }, index) => {
        return renderOptgroups(group, options, index);
      })}
    </select>
  );
};

type EditorProps = {
  onChange: (name: string, getContent: string) => void,
  defaultValue?: string,
  onShifEnter?: () => void,
};

type State = {
  editorState: any;
}

export default class Editor extends Component<EditorProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      editorState: createStateFromHTML(
        EditorState.createEmpty(),
        props.defaultValue || ''
      )
    };

    this.onChange = this.onChange.bind(this);
    this.getContent = this.getContent.bind(this);
  }

  getContent(editorState) {
    return toHTML(editorState);
  }

  onChange(editorState) {
    this.setState({ editorState });
    this.props.onChange('message', this.getContent(editorState));
  }

  render() {
    const props = {
      ...this.props,
      bordered: true,
      editorState: this.state.editorState,
      controls: [
        <DynamicContent
          key="dynamic-content-control"
          editorState={this.state.editorState}
          onEditorStateChange={this.onChange}
        />
      ],

      onChange: this.onChange
    };

    return <ErxesEditor {...props} />;
  }
}