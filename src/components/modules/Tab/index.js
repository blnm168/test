if (!window.Helper) {
  window.Helper = {}
}

const webRoot = window.location.host

if (
  process.env.NODE_ENV === 'development' ||
  !window.document.domain.includes('yiguo.com')
) {
  window.Helper.tab = {
    showTab: (title, url) => {
      window.open(url)
    },
    closeTab: (title, tabId) => {
      console.log('close', title)
    },
    gotoTab: function (title) {
      console.log('goto', title)
    },
    reloadTab: function (title) {
      console.log('reload', title)
    }
  }
  window.Helper.home = () => {
    console.log('logout')
  }
} else {
  window.document.domain = 'yiguo.com'
  window.Helper.tab = {
    showTab: function (title, url) {
      // url = getAbsoluteUrl(url)
      url = `http://${webRoot}/${url}`
      window.top.YGApi.Tabs.showTab(title, url)
    },
    closeTab: function (title, tabId) {
      window.top.YGApi.Tabs.closeTab(title, tabId)
    },
    gotoTab: function (title) {
      window.top.YGApi.Tabs.showTab(title)
    },
    reloadTab: function (title) {
      window.top.YGApi.Tabs.reloadTab(title)
    },
    currentTab: function (title) {
      return window.top.YGApi.Tabs.getTabFrame(title)
    },
    currentTabBody: function (title) {
      var currentTab = window.top.YGApi.Tabs.getTabFrame(title)
      if (currentTab) {
        return currentTab[0].contentWindow.document
      }
    }
  }
  if (window.top && window.top.YGApi && window.top.YGApi.Home) {
    window.Helper.home = window.top.YGApi.Home.loginPage
  }
}

window.Helper.tab.fromToTab = (fromTitle, toTitle) => {
  Helper.tab.reloadTab(toTitle)
  setTimeout(() => {
    Helper.tab.gotoTab(toTitle)
    setTimeout(() => {
      Helper.tab.closeTab(fromTitle)
    }, 200)
  }, 1000)
}
