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

interface PolicyinvinsenseAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const PolicyinvinsenseApp = ({
  basename,
  notifications,
  http,
  navigation,
}: PolicyinvinsenseAppDeps) => {

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
                        id="PolicyManagement.helloWorldText"
                        defaultMessage="Welcome to Policy Management Screen"
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
                              id="PolicyManagement.congratulationsTitle"
                              defaultMessage="PolicyManagement Screen" />
                          </h2>
                        </EuiTitle>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPageContentHeader>
                  <EuiPageContentBody>
                    <header className="header">
                      <div className="header-content responsive-wrapper">
                        <div className="header-logo">
                          <a href="#">
                            <div>
                              <img src="https://assets.codepen.io/285131/untitled-ui-icon.svg" />
                            </div>
                            <img src="https://assets.codepen.io/285131/untitled-ui.svg" />
                          </a>
                        </div>
                        <div className="header-navigation">
                          <nav className="header-navigation-links">
                            <a href="#"> Home </a>
                            <a href="#"> Dashboard </a>
                            <a href="#"> Projects </a>
                            <a href="#"> Tasks </a>
                            <a href="#"> Reporting </a>
                            <a href="#"> Users </a>
                          </nav>
                          <div className="header-navigation-actions">
                            <a href="#" className="button">
                              <i className="ph-lightning-bold"></i>
                              <span>Upgrade now</span>
                            </a>
                            <a href="#" className="icon-button">
                              <i className="ph-gear-bold"></i>
                            </a>
                            <a href="#" className="icon-button">
                              <i className="ph-bell-bold"></i>
                            </a>
                            <a href="#" className="avatar">
                              <img src="https://assets.codepen.io/285131/hat-man.png" alt="" />
                            </a>
                          </div>
                        </div>
                        <a href="#" className="button">
                          <i className="ph-list-bold"></i>
                          <span>Menu</span>
                        </a>
                      </div>
                    </header>
                    <main className="main">
                      <div className="responsive-wrapper">
                        <div className="main-header">
                          <h1>Settings</h1>
                          <div className="search">
                            <input type="text" placeholder="Search" />
                            <button type="submit">
                              <i className="ph-magnifying-glass-bold"></i>
                            </button>
                          </div>
                        </div>
                        <div className="horizontal-tabs">
                          <a href="#">My details</a>
                          <a href="#">Profile</a>
                          <a href="#">Password</a>
                          <a href="#">Team</a>
                          <a href="#">Plan</a>
                          <a href="#">Billing</a>
                          <a href="#">Email</a>
                          <a href="#">Notifications</a>
                          <a href="#" className="active">Integrations</a>
                          <a href="#">API</a>
                        </div>
                        <div className="content-header">
                          <div className="content-header-intro">
                            <h2>Intergrations and connected apps</h2>
                            <p>Supercharge your workflow and connect the tool you use every day.</p>
                          </div>
                          <div className="content-header-actions">
                            <a href="#" className="button">
                              <i className="ph-faders-bold"></i>
                              <span>Filters</span>
                            </a>
                            <a href="#" className="button">
                              <i className="ph-plus-bold"></i>
                              <span>Request integration</span>
                            </a>
                          </div>
                        </div>
                        <div className="content">
                          <div className="content-panel">
                            <div className="vertical-tabs">
                              <a href="#" className="active">View all</a>
                              <a href="#">Developer tools</a>
                              <a href="#">Communication</a>
                              <a href="#">Productivity</a>
                              <a href="#">Browser tools</a>
                              <a href="#">Marketplace</a>
                            </div>
                          </div>
                          <div className="content-main">
                            <div className="card-grid">
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/zeplin.svg" /></span>
                                    <h3>Zeplin</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Collaboration between designers and developers.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/github.svg" /></span>
                                    <h3>GitHub</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Link pull requests and automate workflows.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/figma.svg" /></span>
                                    <h3>Figma</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Embed file previews in projects.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/zapier.svg" /></span>
                                    <h3>Zapier</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Build custom automations and integrations with apps.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/notion.svg" /></span>
                                    <h3>Notion</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Embed notion pages and notes in projects.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/slack.svg" /></span>
                                    <h3>Slack</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Send notifications to channels and create projects.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/zendesk.svg" /></span>
                                    <h3>Zendesk</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Link and automate Zendesk tickets.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/jira.svg" /></span>
                                    <h3>Atlassian JIRA</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Plan, track, and release great software.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/dropbox.svg" /></span>
                                    <h3>Dropbox</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Everything you need for work, all in one place.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/google-chrome.svg" /></span>
                                    <h3>Google Chrome</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Link your Google account to share bookmarks across your entire team.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/discord.svg" /></span>
                                    <h3>Discord</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" checked />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Keep in touch with your customers without leaving the app.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                              <article className="card">
                                <div className="card-header">
                                  <div>
                                    <span><img src="https://assets.codepen.io/285131/google-drive.svg" /></span>
                                    <h3>Google Drive</h3>
                                  </div>
                                  <label className="toggle">
                                    <input type="checkbox" />
                                    <span></span>
                                  </label>
                                </div>
                                <div className="card-body">
                                  <p>Link your Google account to share files across your entire team.</p>
                                </div>
                                <div className="card-footer">
                                  <a href="#">View integration</a>
                                </div>
                              </article>
                            </div>
                          </div>
                        </div>
                      </div>
                    </main>
                  </EuiPageContentBody>
                </EuiPageContent>
                <EuiFlexGroup alignItems="center" justifyContent='center' >
                  <EuiFlexItem grow={false}>
                  </EuiFlexItem>
                  <EuiFlexItem grow={6}>
                    <EuiText color='subdued' size="s">
                      <EuiTextAlign textAlign="center">
                        PolicyManagement Plugin<small>v</small>1.0.3
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
                <FormattedMessage id="policyinvinsense.buttonText" defaultMessage="Refresh plugin" />
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </>
    }</>
  );
};

