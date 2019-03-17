import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import onClickOutside, { InjectedOnClickOutProps } from 'react-onclickoutside';

import { IStoreState } from 'store/modules';
import { ISidebarState, Actions as sidebarActions } from 'store/modules/sidebar';
import { Hamburger, Sidebar } from 'components';

interface IProps {
  sidebarState: ISidebarState;
  dispatchToggleSidebar(visible: boolean): void;
  dispatchExpandedNavi(expand: boolean): void;
}

export type Props = IProps & InjectedOnClickOutProps;

class SidebarContainer extends React.Component<Props> {
  hamburgerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.hamburgerRef = React.createRef();
  }
  componentDidMount() {
    window.addEventListener('resize', this.sidebarResizeEvent);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.sidebarResizeEvent);
  }

  handleClickOutside = (e: React.MouseEvent<HTMLElement>): void => {
    const { toggleSidebar, hamburgerRef } = this;
    const { sidebarState } = this.props;
    const node = hamburgerRef.current!;
    if (!sidebarState.visible || window.innerWidth > 768) return;
    if (node.contains(e.target as HTMLElement)) return;
    toggleSidebar();
  };
  setSearchValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target);
  };
  toggleSidebar = (): void => {
    const { sidebarState, dispatchToggleSidebar } = this.props;
    dispatchToggleSidebar(!sidebarState.visible);
  };
  sidebarResizeEvent = (): void => {
    const { sidebarState, dispatchToggleSidebar } = this.props;
    const { visible } = sidebarState;
    if (!visible && window.innerWidth > 768) dispatchToggleSidebar(true);
    if (visible && window.innerWidth <= 768) dispatchToggleSidebar(false);
  };
  expandedNavi = (expand: boolean) => (): void => {
    const { dispatchExpandedNavi } = this.props;
    dispatchExpandedNavi(expand);
  };

  render() {
    const { toggleSidebar, expandedNavi, setSearchValue } = this;
    const { sidebarState } = this.props;
    return (
      <React.Fragment>
        <Sidebar
          sidebarState={sidebarState}
          expandedNavi={expandedNavi}
          setSearchValue={setSearchValue}
          key="sidebar"
        />
        {window.innerWidth <= 768 && (
          <Hamburger
            visible={sidebarState.visible}
            toggleSidebar={toggleSidebar}
            hamburgerRef={this.hamburgerRef}
            key="hamburger"
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  sidebarState: state.sidebar,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchToggleSidebar(visible: boolean) {
    return dispatch(sidebarActions.toggleSidebar(visible));
  },
  dispatchExpandedNavi(expand: boolean) {
    return dispatch(sidebarActions.expandedNavi(expand));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(onClickOutside(SidebarContainer));
