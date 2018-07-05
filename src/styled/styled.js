/*
This file is baded on https://github.com/JacquesBonet/jss-material-ui

Copyright (c) 2018 Kopano b.v.
Copyright (c) 2016-2018 Team Wertarbyte and contributors

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* eslint-disable */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = (theme, props, style) => {
    return typeof style === 'function'
        ? style(theme, props)
        : style;
};

class StyledComponent extends React.Component {
    render() {
        const { classes, className = '', WrappedComponent, ...passThroughProps } = this.props;

        return (
            <WrappedComponent
                className={classNames(classes[Object.keys(classes)[0]], className)}
                {...passThroughProps}
            />
        );
    }
}

StyledComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
};

const styled = (WrappedComponent, customProps = {}) => {
    return (style, options = {}) => {
        const HOCProps = WrappedComponent => {
            return class _HOCProps extends React.Component {
                constructor(props) {
                    super(props);
                    this.FinalComponent =
                        withStyles(theme => styles(theme, props, style), options)(StyledComponent);
                }

                render() {
                    return (
                        <this.FinalComponent {...customProps} {...this.props} WrappedComponent={WrappedComponent}/>
                    );
                }
            };
        };
        return HOCProps(WrappedComponent);
    };
};

export default styled;
