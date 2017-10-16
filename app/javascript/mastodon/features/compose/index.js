import React from 'react';
import ComposeFormContainer from './containers/compose_form_container';
import NavigationContainer from './containers/navigation_container';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { mountCompose, unmountCompose } from '../../actions/compose';
import Link from 'react-router-dom/Link';
import { injectIntl, defineMessages } from 'react-intl';
import SearchContainer from './containers/search_container';
import Motion from 'react-motion/lib/Motion';
import spring from 'react-motion/lib/spring';
import SearchResultsContainer from './containers/search_results_container';
import { changeComposing } from '../../actions/compose';

const messages = defineMessages({
  home_timeline: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Direct messages' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocks' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Mutes' },
  pins: { id: 'navigation_bar.pins', defaultMessage: 'Pinned toots' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
});

const mapStateToProps = state => ({
  columns: state.getIn(['settings', 'columns']),
  showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
});

@connect(mapStateToProps)
@injectIntl
export default class Compose extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    columns: ImmutablePropTypes.list.isRequired,
    multiColumn: PropTypes.bool,
    showSearch: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    this.props.dispatch(mountCompose());
  }

  componentWillUnmount () {
    this.props.dispatch(unmountCompose());
  }

  onFocus = () => {
    this.props.dispatch(changeComposing(true));
  }

  onBlur = () => {
    this.props.dispatch(changeComposing(false));
  }

  render () {
    const { multiColumn, showSearch, intl } = this.props;

    let header = '';

    if (multiColumn) {
      const { columns } = this.props;
      header = (
        <div className='drawer__header'>
          <Link title={intl.formatMessage(messages.direct)} className='drawer__tab' to='/timelines/direct'><i role='img' aria-label={intl.formatMessage(messages.direct)} className='fa fa-fw fa-envelope' /></Link>
          <Link title={intl.formatMessage(messages.mutes)} className='drawer__tab' to='/mutes'><i role='img' aria-label={intl.formatMessage(messages.mutes)} className='fa fa-fw fa-volume-off' /></Link>
          <Link title={intl.formatMessage(messages.blocks)} className='drawer__tab' to='/blocks'><i role='img' aria-label={intl.formatMessage(messages.blocks)} className='fa fa-fw fa-ban' /></Link>
          <Link title={intl.formatMessage(messages.pins)} className='drawer__tab' to='/pinned'><i role='img' aria-label={intl.formatMessage(messages.pins)} className='fa fa-fw fa-thumb-tack' /></Link>
          <a title={intl.formatMessage(messages.preferences)} className='drawer__tab' href='/settings/preferences'><i role='img' aria-label={intl.formatMessage(messages.preferences)} className='fa fa-fw fa-cog' /></a>
          <a title={intl.formatMessage(messages.logout)} className='drawer__tab' href='/auth/sign_out' data-method='delete'><i role='img' aria-label={intl.formatMessage(messages.logout)} className='fa fa-fw fa-sign-out' /></a>
        </div>
      );
    }

    return (
      <div className='drawer'>
        {header}

        <SearchContainer />

        <div className='drawer__pager'>
          <div className='drawer__inner' onFocus={this.onFocus}>
            <NavigationContainer onClose={this.onBlur} />
            <ComposeFormContainer />
          </div>

          <Motion defaultStyle={{ x: -100 }} style={{ x: spring(showSearch ? 0 : -100, { stiffness: 210, damping: 20 }) }}>
            {({ x }) =>
              <div className='drawer__inner darker' style={{ transform: `translateX(${x}%)`, visibility: x === -100 ? 'hidden' : 'visible' }}>
                <SearchResultsContainer />
              </div>
            }
          </Motion>
        </div>
      </div>
    );
  }

}
