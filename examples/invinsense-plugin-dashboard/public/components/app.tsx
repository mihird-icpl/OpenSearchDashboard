import React, { useState, useEffect, useMemo, useRef } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  CustomItemAction,
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
  EuiBasicTableColumn,
  Criteria,
  EuiHealth,
  EuiSpacer,
  EuiIcon,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCheckableCard,
  EuiTextAlign,
  EuiInMemoryTable,
  EuiToolTip,
  EuiButtonIcon,
  EuiConfirmModal,
  EuiTextArea,
  EuiBadge,
  EuiLink,
  EuiCode,
  EuiToast,
  EuiCheckbox,
  EuiFieldSearch
} from '@elastic/eui';

import { htmlIdGenerator } from "@elastic/eui/lib/services"

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

interface ConfigurationAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const ConfigurationApp = ({
  basename,
  notifications,
  http,
  navigation,
}: ConfigurationAppDeps) => {

  const [isAuthorized, setIsAuthorized] = useState(true);

  const [authorizationModal, setAuthorizationModal] = useState(false);

  const radioName = htmlIdGenerator()();
  const [radio, setRadio] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  // const [isFirstLoad, setIsFirstLoad] = useState(true)


  function isAdminUser(data: any) {
    if (data.backend_roles.length > 0) {
      if (data.backend_roles.includes("admin") || data.backend_roles.includes("Wazuh_Admin")) {
        console.log("admin user")
      } else {
        setAuthorizationModal(true);
      }
    } else {
      setAuthorizationModal(true);
    }
  }

  function openAndCloseWindow(url: string | URL | undefined) {
    // window.location.href = `${globalUrl}`
    const newWindow = window.open(url);
    setTimeout(() => {
      if (newWindow) {
        // newWindow.location.reload();
      }
    }, 3000)

    setTimeout(() => {
      if (newWindow) {
        // newWindow.close();
        // location.reload();
      }
    }, 10000)
  }

  function redirectHome() {
    window.location.replace(`api/example/app/wazuh#/health-check`);
  }

  return (
    <>{isAuthorized ? <>
      <Router basename={basename}>
        <I18nProvider>
          <>
            <navigation.ui.TopNavMenu
              appName={PLUGIN_ID}
              showSearchBar={false}
              useDefaultBehaviors={false} />
            <EuiPage>
              <EuiPageBody component="main">
                <EuiPageHeader>
                  <EuiTitle size="l">
                    <h1>
                      <FormattedMessage
                        id="configuration.helloWorldText"
                        defaultMessage="Welcome to Configuration Screen"
                        values={{ name: PLUGIN_NAME }} />
                    </h1>
                  </EuiTitle>
                </EuiPageHeader>
                <EuiPageContent>
                  <EuiPageContentHeader>
                    <EuiFlexGroup gutterSize="l" wrap>
                      <EuiFlexItem grow={false}>
                        <img
                          src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NiA5NiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fS5jbHMtMntmaWxsOm5vbmU7fS5jbHMtM3tmaWxsOiMyMjkwMjI7fS5jbHMtNHtmaWxsOiMwYTc1MzM7fS5jbHMtNXtmaWxsOiMwMzA7b3BhY2l0eTowLjU7aXNvbGF0aW9uOmlzb2xhdGU7fS5jbHMtNntmaWxsOiMwY2IwNGE7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5JbnZpbnNlbnNlLWljb24tOTZ4OTY8L3RpdGxlPjxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iNDcuNDciIGN5PSI3My4yMyIgcj0iMTcuMzMiLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iNDguMDUgMTUuNzcgMzYuMDkgMCA0OC4wNSAxNS44NCA0OC4wNSAxNS43NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMyIgcG9pbnRzPSI0OC4wNSAxNS44NCAzNi4wOSAwIDEzLjMgMCA0OC4wNSA0Ni4yNyA1OS40OCAzMC44NSA0OC4wNSAxNS43NyA0OC4wNSAxNS44NCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtNCIgcG9pbnRzPSI1OS44MiAwIDQ4LjA1IDE1Ljc3IDU5LjQ4IDMwLjg1IDgyLjcgMCA1OS44MiAwIi8+PHBvbHlnb24gY2xhc3M9ImNscy01IiBwb2ludHM9IjQ5LjkxIDEzLjMxIDQ4LjA1IDE1Ljc3IDU5LjQ4IDMwLjg1IDYxLjY5IDI3Ljk2IDQ5LjkxIDEzLjMxIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNNDguMDUsNjEuNDZhMy44LDMuOCwwLDAsMC0zLjgxLDMuNzlWNjloNy42MlY2NS4yN2EzLjgsMy44LDAsMCwwLTMuNzktMy44MVoiLz48cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Ik00OC4wNSw0Ni4zNEEyNC44MywyNC44MywwLDEsMCw3Mi44OCw3MS4xNywyNC44MywyNC44MywwLDAsMCw0OC4wNSw0Ni4zNFpNNTguODEsODEuNkEyLjgyLDIuODIsMCwwLDEsNTYsODQuMzlINDAuMDhhMi44LDIuOCwwLDAsMS0yLjc5LTIuNzlWNzJhMi44MywyLjgzLDAsMCwxLDIuNzktMi44MWguNDJWNjUuNWE3LjU5LDcuNTksMCwxLDEsMTUuMTcsMHYzLjcyaC40MmEyLjcyLDIuNzIsMCwwLDEsMi44LDIuNjRWNzJaIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNNDUuMzMsNzQuMTRhLjM0LjM0LDAsMCwxLS4wOS0uMjUuNTIuNTIsMCwwLDEsLjI2LS4zNWwxLjYyLTEuMzVhMS44MSwxLjgxLDAsMCwxLC45My0uMzRINDlhLjY0LjY0LDAsMCwxLC40Mi4xOC42LjYsMCwwLDEsLjE4LjQydjguMTNhLjY0LjY0LDAsMCwxLS4xOC40MmMtLjE3LjA5LS4yNi4xOC0uNDIuMThINDcuNzRhLjYyLjYyLDAsMCwxLS42LS42Vjc0LjIzbC0uNzUuNTljLS4wOS4wOS0uMTguMDktLjM0LjA5cy0uMTctLjA5LS4yNi0uMThaIi8+PC9zdmc+"
                          alt="Invinsense"
                          width={"40px"}
                          height={"40px"}
                        />
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiTitle>
                          <h2>
                            <FormattedMessage
                              id="configuration.congratulationsTitle"
                              defaultMessage="Configuartion Screen" />
                          </h2>
                        </EuiTitle>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPageContentHeader>
                  <EuiPageContentBody>
                    <div className="task-manager">
                      <div className="left-bar">
                        <div className="upper-part">
                          <div className="actions">
                            <div className="circle"></div>
                            <div className="circle-2"></div>
                          </div>
                        </div>
                        <div className="left-content">
                          <ul className="action-list">
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="feather feather-inbox"
                                viewBox="0 0 24 24">
                                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                                <path
                                  d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                              </svg>
                              <span>Inbox</span>
                            </li>
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-star">
                                <polygon
                                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <span> Today</span>
                            </li>
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="feather feather-calendar"
                                viewBox="0 0 24 24">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                <path d="M16 2v4M8 2v4m-5 4h18" />
                              </svg>
                              <span>Upcoming</span>
                            </li>
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-hash">
                                <line x1="4" y1="9" x2="20" y2="9" />
                                <line x1="4" y1="15" x2="20" y2="15" />
                                <line x1="10" y1="3" x2="8" y2="21" />
                                <line x1="16" y1="3" x2="14" y2="21" /></svg>
                              <span>Important</span>
                            </li>
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-users">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                              <span>Meetings</span>
                            </li>
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="feather feather-trash"
                                viewBox="0 0 24 24">
                                <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              <span>Trash</span>
                            </li>
                          </ul>
                          <ul className="category-list">
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-users">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                              <span>Family</span>
                            </li>
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="feather feather-sun"
                                viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="5" />
                                <path
                                  d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                              </svg>
                              <span>Vacation</span>
                            </li>
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-trending-up">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" /></svg>
                              <span>Festival</span>
                            </li>
                            <li className="item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-zap">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                              <span>Concerts</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="page-content">
                        <div className="header">Today Tasks</div>
                        <div className="content-categories">
                          <div className="label-wrapper">
                            <input className="nav-item" name="nav" type="radio" id="opt-1" />
                            <label className="category" htmlFor="opt-1">All</label>
                          </div>
                          <div className="label-wrapper">
                            <input className="nav-item" name="nav" type="radio" id="opt-2" checked />
                            <label className="category" htmlFor="opt-2">Important</label>
                          </div>
                          <div className="label-wrapper">
                            <input className="nav-item" name="nav" type="radio" id="opt-3" />
                            <label className="category" htmlFor="opt-3">Notes</label>
                          </div>
                          <div className="label-wrapper">
                            <input className="nav-item" name="nav" type="radio" id="opt-4" />
                            <label className="category" htmlFor="opt-4">Links</label>
                          </div>
                        </div>
                        <div className="tasks-wrapper">
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-1" checked />
                            <label htmlFor="item-1">
                              <span className="label-text">Dashboard Design Implementation</span>
                            </label>
                            <span className="tag approved">Approved</span>
                          </div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-2" checked />
                            <label htmlFor="item-2">
                              <span className="label-text">Create a userflow</span>
                            </label>
                            <span className="tag progress">In Progress</span>
                          </div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-3" />
                            <label htmlFor="item-3">
                              <span className="label-text">Application Implementation</span>
                            </label>
                            <span className="tag review">In Review</span>
                          </div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-4" />
                            <label htmlFor="item-4">
                              <span className="label-text">Create a Dashboard Design</span>
                            </label>
                            <span className="tag progress">In Progress</span>
                          </div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-5" />
                            <label htmlFor="item-5">
                              <span className="label-text">Create a Web Application Design</span>
                            </label>
                            <span className="tag approved">Approved</span>
                          </div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-6" />
                            <label htmlFor="item-6">
                              <span className="label-text">Interactive Design</span>
                            </label>
                            <span className="tag review">In Review</span>
                          </div>
                          <div className="header upcoming">Upcoming Tasks</div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-7" />
                            <label htmlFor="item-7">
                              <span className="label-text">Dashboard Design Implementation</span>
                            </label>
                            <span className="tag waiting">Waiting</span>
                          </div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-8" />
                            <label htmlFor="item-8">
                              <span className="label-text">Create a userflow</span>
                            </label>
                            <span className="tag waiting">Waiting</span>
                          </div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-9" />
                            <label htmlFor="item-9">
                              <span className="label-text">Application Implementation</span>
                            </label>
                            <span className="tag waiting">Waiting</span>
                          </div>
                          <div className="task">
                            <input className="task-item" name="task" type="checkbox" id="item-10" />
                            <label htmlFor="item-10">
                              <span className="label-text">Create a Dashboard Design</span>
                            </label>
                            <span className="tag waiting">Waiting</span>
                          </div>
                        </div>
                      </div>
                      <div className="right-bar">
                        <div className="top-part">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            className="feather feather-users">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                          <div className="count">6</div>
                        </div>
                        <div className="header">Schedule</div>
                        <div className="right-content">
                          <div className="task-box yellow">
                            <div className="description-task">
                              <div className="time">08:00 - 09:00 AM</div>
                              <div className="task-name">Product Review</div>
                            </div>
                            <div className="more-button"></div>
                            <div className="members">
                              <img
                                src="https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
                                alt="member" />
                              <img
                                src="https://images.unsplash.com/photo-1476657680631-c07285ff2581?ixlib=rb-1.2.1&auto=format&fit=crop&w=2210&q=80"
                                alt="member-2" />
                              <img
                                src="https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80"
                                alt="member-3" />
                              <img
                                src="https://images.unsplash.com/photo-1455504490126-80ed4d83b3b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80"
                                alt="member-4" />
                            </div>
                          </div>
                          <div className="task-box blue">
                            <div className="description-task">
                              <div className="time">10:00 - 11:00 AM</div>
                              <div className="task-name">Design Meeting</div>
                            </div>
                            <div className="more-button"></div>
                            <div className="members">
                              <img
                                src="https://images.unsplash.com/photo-1484688493527-670f98f9b195?ixlib=rb-1.2.1&auto=format&fit=crop&w=2230&q=80"
                                alt="member" />
                              <img
                                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80"
                                alt="member-2" />
                              <img
                                src="https://images.unsplash.com/photo-1455504490126-80ed4d83b3b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80"
                                alt="member-3" />
                            </div>
                          </div>
                          <div className="task-box red">
                            <div className="description-task">
                              <div className="time">01:00 - 02:00 PM</div>
                              <div className="task-name">Team Meeting</div>
                            </div>
                            <div className="more-button"></div>
                            <div className="members">
                              <img
                                src="https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
                                alt="member" />
                              <img
                                src="https://images.unsplash.com/photo-1475552113915-6fcb52652ba2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1934&q=80"
                                alt="member-2" />
                              <img
                                src="https://images.unsplash.com/photo-1493752603190-08d8b5d1781d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"
                                alt="member-3" />
                              <img
                                src="https://images.unsplash.com/photo-1484688493527-670f98f9b195?ixlib=rb-1.2.1&auto=format&fit=crop&w=2230&q=80"
                                alt="member-4" />
                            </div>
                          </div>
                          <div className="task-box green">
                            <div className="description-task">
                              <div className="time">03:00 - 04:00 PM</div>
                              <div className="task-name">Release Event</div>
                            </div>
                            <div className="more-button"></div>
                            <div className="members">
                              <img
                                src="https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=943&q=80"
                                alt="member" />
                              <img
                                src="https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=881&q=80"
                                alt="member-2" />
                              <img
                                src="https://images.unsplash.com/photo-1521122872341-065792fb2fa0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2208&q=80"
                                alt="member-3" />
                              <img
                                src="https://images.unsplash.com/photo-1486302913014-862923f5fd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=3400&q=80"
                                alt="member-4" />
                              <img
                                src="https://images.unsplash.com/photo-1484187216010-59798e9cc726?ixlib=rb-1.2.1&auto=format&fit=crop&w=955&q=80"
                                alt="member-5" />
                            </div>
                          </div>
                          <div className="task-box blue">
                            <div className="description-task">
                              <div className="time">08:00 - 09:00 PM</div>
                              <div className="task-name">Release Event</div>
                            </div>
                            <div className="more-button"></div>
                            <div className="members">
                              <img
                                src="https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=943&q=80"
                                alt="member" />
                              <img
                                src="https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=881&q=80"
                                alt="member-2" />
                              <img
                                src="https://images.unsplash.com/photo-1521122872341-065792fb2fa0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2208&q=80"
                                alt="member-3" />
                              <img
                                src="https://images.unsplash.com/photo-1486302913014-862923f5fd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=3400&q=80"
                                alt="member-4" />
                              <img
                                src="https://images.unsplash.com/photo-1484187216010-59798e9cc726?ixlib=rb-1.2.1&auto=format&fit=crop&w=955&q=80"
                                alt="member-5" />
                            </div>
                          </div>
                          <div className="task-box yellow">
                            <div className="description-task">
                              <div className="time">11:00 - 12:00 PM</div>
                              <div className="task-name">Practise</div>
                            </div>
                            <div className="more-button"></div>
                            <div className="members">
                              <img
                                src="https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
                                alt="member" />
                              <img
                                src="https://images.unsplash.com/photo-1476657680631-c07285ff2581?ixlib=rb-1.2.1&auto=format&fit=crop&w=2210&q=80"
                                alt="member-2" />
                              <img
                                src="https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80"
                                alt="member-3" />
                              <img
                                src="https://images.unsplash.com/photo-1455504490126-80ed4d83b3b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80"
                                alt="member-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </EuiPageContentBody>
                </EuiPageContent>
                <EuiFlexGroup alignItems="center" justifyContent='center' >
                  <EuiFlexItem grow={false}>
                  </EuiFlexItem>
                  <EuiFlexItem grow={6}>
                    <EuiText color='subdued' size="s">
                      <EuiTextAlign textAlign="center">
                        Configuration Plugin<small>v</small>1.0.3
                      </EuiTextAlign>
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPageBody>
            </EuiPage>
          </>
        </I18nProvider>
      </Router>
    </> :
      <>
        <div>
          <EuiFlexGroup alignItems="center" justifyContent="spaceAround">
            <EuiFlexItem grow={true}>
              <EuiText>
                <EuiTextAlign textAlign="center">
                  Session timed out.
                </EuiTextAlign>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup alignItems="center" justifyContent="spaceAround">
            <EuiFlexItem grow={false}>
              <EuiButton type="primary"
                color="primary"
                size="s"
                iconType="refresh"
                fill={true}
                // isDisabled={agent.agentStatus != 'active' ? true : false}
                onClick={() => { openAndCloseWindow(`api/example/app/wazuh#/health-check`); }}>
                <FormattedMessage id="testinvinsense.buttonText" defaultMessage="Refresh plugin" />
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </>
    }</>
  );
};

