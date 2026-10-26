(()=>{
'use strict';
const $=selector=>document.querySelector(selector), byId=id=>document.getElementById(id);
const customerRoutes=[
  {id:'dashboard',label:'Overview',icon:'◫'},
  {id:'wallet',label:'Wallet & tokens',icon:'◈'},
  {id:'vouchers',label:'Rewards shop',icon:'◇'},
  {id:'settings',label:'Settings',icon:'⚙'}
];
const adminRoutes=[
  {id:'admin',label:'Command center',icon:'▦'},
  {id:'admin/tokens',label:'Token forge',icon:'◈'},
  {id:'admin/merchants',label:'Merchant hub',icon:'⌂'},
  {id:'admin/audit',label:'Audit & activity',icon:'≋'}
];
let shell,outlet,navList,routeTitle,activeView=null,ready=false;
const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function make(tag,attrs={},text=''){
  const node=document.createElement(tag);
  Object.entries(attrs).forEach(([key,value])=>{
    if(key==='class')node.className=value;
    else if(key==='dataset')Object.assign(node.dataset,value);
    else node.setAttribute(key,value);
  });
  if(text)node.textContent=text;
  return node;
}
function makePage(id,title){
  const page=make('section',{class:'pcg-route-page',id:'page-'+id,dataset:{route:id},'aria-labelledby':'heading-'+id});
  page.append(make('h1',{id:'heading-'+id,class:'pcg-page-title'},title));
  return page;
}
function buildShell(){
  shell=make('div',{id:'pcgAppShell',class:'pcg-app-shell',hidden:''});
  const sidebar=make('aside',{class:'pcg-sidebar'});
  const brand=make('a',{class:'pcg-sidebar-brand',href:'#dashboard','aria-label':'PCG Rewards overview'});
  brand.append(make('img',{src:'pcg-rewards-logo.jpg',alt:''}),make('span',{},'PCG REWARDS'));
  sidebar.append(brand,make('p',{class:'pcg-nav-label'},'CUSTOMER SPACE'));
  navList=make('nav',{class:'pcg-side-nav','aria-label':'Customer navigation'});
  sidebar.append(navList);
  const sidebarFoot=make('div',{class:'pcg-sidebar-foot'});
  sidebarFoot.append(make('span',{class:'pcg-system-state'},'Rewards account'));
  sidebar.append(sidebarFoot);
  const content=make('div',{class:'pcg-app-content'});
  const header=make('header',{class:'pcg-appbar'});
  const headerStart=make('div',{class:'pcg-appbar-start'});
  const back=make('button',{class:'pcg-icon-button',type:'button','aria-label':'Go back','title':'Go back'},'←');
  back.addEventListener('click',()=>{
    if(history.length>1)history.back();
    else navigate(document.body.dataset.role==='admin'?'#admin':'#dashboard');
  });
  routeTitle=make('div',{class:'pcg-route-heading'});
  routeTitle.append(make('span',{class:'pcg-route-eyebrow'},'PCG REWARDS'),make('strong',{id:'pcgRouteTitle'},'Overview'));
  headerStart.append(back,routeTitle);
  const headerActions=make('div',{class:'pcg-appbar-actions'});
  const liveBalance=make('div',{class:'pcg-live-balance','aria-live':'polite'});
  liveBalance.append(make('span',{},'POINTS'),make('strong',{id:'pcgHeaderPoints'},'--'));
  const logout=make('button',{class:'btn secondary pcg-logout',id:'pcgLogout',type:'button'},'Log out');
  logout.addEventListener('click',()=>{
    const customer=byId('customerSignOut'),admin=byId('signOut');
    if(document.body.dataset.role==='admin'&&admin)admin.click();
    else if(customer)customer.click();
    else navigate('#login');
  });
  headerActions.append(liveBalance,logout);
  header.append(headerStart,headerActions);
  outlet=make('main',{class:'pcg-route-outlet','id':'pcgRouteOutlet','aria-live':'polite'});
  content.append(header,outlet);
  shell.append(sidebar,content);
  document.body.append(shell);
  buildGateway();
  buildCustomerPages();
  buildSettings();
  buildAdminPages();
}
function buildGateway(){
  const gateway=make('main',{id:'pcgPublicGateway',class:'pcg-public-gateway',hidden:''});
  const panel=make('section',{class:'pcg-gateway-panel'});
  const identity=make('div',{class:'pcg-gateway-identity'});
  identity.append(make('img',{src:'pcg-rewards-logo.jpg',alt:'PCG REWARDS'}));
  const copy=make('div',{class:'pcg-gateway-copy'});
  copy.append(make('div',{class:'eyebrow'},'Your local rewards account'),make('h1',{},'Every visit has value.'),make('p',{},'Sign in to view your rewards, activity and participating shop offers.'));
  const actions=make('div',{class:'pcg-gateway-actions'});
  const login=make('button',{class:'btn',type:'button'},'Customer login');
  login.addEventListener('click',()=>{byId('showCustomerLogin')?.click();navigate('#login')});
  const signup=make('button',{class:'btn secondary',type:'button'},'Create account');
  signup.addEventListener('click',()=>{byId('showCustomerSignup')?.click();navigate('#signup')});
  const admin=make('a',{class:'pcg-admin-entry',href:'#admin-login'},'Administrator access');
  actions.append(login,signup);
  copy.append(actions);
  identity.append(copy);
  const account=byId('customerAuthOverlay');
  if(account){
    account.classList.remove('auth-overlay');
    account.removeAttribute('role');account.removeAttribute('aria-modal');
    account.hidden=false;
    account.classList.add('pcg-gateway-account');
    panel.append(identity,account,admin);
  }else panel.append(identity,admin);
  gateway.append(panel);
  outlet.append(gateway);
}
function buildCustomerPages(){
  const dashboard=byId('customerDashboard');
  if(!dashboard)return;
  dashboard.hidden=false;
  dashboard.classList.add('pcg-customer-root');
  const wrap=dashboard.querySelector('.wrap');
  const heading=wrap?.querySelector('.admin-heading');
  const wallet=wrap?.querySelector('.wallet-card');
  const panels=wrap?[...wrap.querySelectorAll(':scope > .admin-panel')]:[];
  const catalog=panels.find(node=>node.querySelector('#catalogGrid'));
  const activity=panels.find(node=>node.querySelector('#customerActivity'));
  const overview=makePage('dashboard','Overview');
  const overviewGrid=make('div',{class:'pcg-overview-grid'});
  const summary=make('article',{class:'pcg-summary-panel'});
  const profile=make('div',{class:'pcg-profile-heading'});
  profile.append(make('div',{class:'pcg-avatar'},'PCG'),make('div',{class:'pcg-profile-copy',id:'pcgProfileSummary'}));
  const points=make('div',{class:'pcg-overview-points'});
  points.append(make('span',{},'AVAILABLE POINTS'),make('strong',{id:'pcgOverviewPoints'},'--'),make('small',{id:'pcgOverviewTier'},'Member tier'));
  summary.append(profile,points);
  const quick=make('div',{class:'pcg-quick-actions'});
  [['wallet','Wallet'],['vouchers','Browse rewards'],['settings','Account settings']].forEach(([route,label])=>{
    const link=make('a',{class:'btn secondary',href:'#'+route},label);quick.append(link);
  });
  summary.append(quick);
  overviewGrid.append(summary);
  if(activity){activity.classList.add('pcg-activity-panel');overviewGrid.append(activity)}
  overview.append(overviewGrid);
  const walletPage=makePage('wallet','Wallet & tokens');
  if(wallet){wallet.classList.add('pcg-wallet-card');walletPage.append(wallet)}
  const walletInfo=make('div',{class:'pcg-wallet-note'});
  walletInfo.append(make('span',{class:'pcg-system-state'},'Balance synchronizes with your rewards ledger.'),make('p',{},'Airtime, utilities and token transfer tools will appear here when the corresponding services are enabled for your account.'));
  walletPage.append(walletInfo);
  const vouchersPage=makePage('vouchers','Rewards shop');
  if(catalog){catalog.classList.add('pcg-catalog-panel');vouchersPage.append(catalog)}
  const settingsPage=makePage('settings','User settings');
  const settingsGrid=make('div',{class:'pcg-settings-grid'});
  const profilePanel=make('section',{class:'panel pcg-settings-panel'});
  profilePanel.append(make('h2',{},'Profile details'),make('p',{class:'small'},'Update the name and mobile number associated with your rewards account.'));
  const profileForm=make('form',{id:'pcgProfileForm'});
  profileForm.innerHTML='<div class="field"><label for="pcgSettingsName">Full name</label><input id="pcgSettingsName" name="full_name" autocomplete="name" maxlength="120" required></div><div class="field"><label for="pcgSettingsPhone">Mobile number</label><input id="pcgSettingsPhone" name="phone" type="tel" autocomplete="tel"></div><p class="small" id="pcgProfileStatus" aria-live="polite"></p><button class="btn" type="submit">Save profile</button>';
  profilePanel.append(profileForm);
  const securityPanel=make('section',{class:'panel pcg-settings-panel'});
  securityPanel.append(make('h2',{},'Security & notifications'),make('p',{class:'small'},'Password reset is sent to the email address on your account. Notification preferences are stored on this device.'));
  const securityActions=make('div',{class:'pcg-settings-actions'});
  securityActions.append(make('button',{class:'btn secondary',id:'pcgPasswordReset',type:'button'},'Send password reset email'));
  const toggleLabel=make('label',{class:'pcg-toggle-row'});
  const toggle=make('input',{id:'pcgNotifications',type:'checkbox'});
  toggleLabel.append(toggle,make('span',{},'Enable account notifications on this device'));
  securityPanel.append(securityActions,toggleLabel,make('p',{class:'small',id:'pcgSecurityStatus','aria-live':'polite'}));
  settingsGrid.append(profilePanel,securityPanel);
  settingsPage.append(settingsGrid);
  dashboard.replaceChildren(overview,walletPage,vouchersPage,settingsPage);
  outlet.append(dashboard);
  wireCustomerPages();
}
function wireCustomerPages(){
  const form=byId('pcgProfileForm');
  form?.addEventListener('submit',async event=>{
    event.preventDefault();
    const status=byId('pcgProfileStatus');
    const button=form.querySelector('button[type="submit"]');button.disabled=true;
    status.textContent='Saving profile…';
    try{
      const saved=await window.PCGStore?.updateProfile?.({name:byId('pcgSettingsName').value.trim(),phone:byId('pcgSettingsPhone').value.trim()});
      if(!saved)throw new Error('Profile updates are unavailable until your session is ready.');
      status.textContent='Profile updated.';
    }catch(error){status.textContent=error.message||'Profile could not be updated.';}
    finally{button.disabled=false;}
  });
  byId('pcgPasswordReset')?.addEventListener('click',async event=>{
    const button=event.currentTarget;button.disabled=true;
    const status=byId('pcgSecurityStatus');status.textContent='Requesting password reset…';
    try{
      const result=await window.PCGStore?.resetPassword?.();
      if(result?.error)throw result.error;
      status.textContent='If the account exists, reset instructions will be sent to its email address.';
    }catch(error){status.textContent=error.message||'Password reset could not be requested.';}
    finally{button.disabled=false;}
  });
  const notifications=byId('pcgNotifications');
  notifications.checked=localStorage.getItem('pcg-notifications')==='true';
  notifications.addEventListener('change',()=>localStorage.setItem('pcg-notifications',String(notifications.checked)));
  const profileObserver=new MutationObserver(syncProfile);
  const greeting=byId('customerGreeting');if(greeting)profileObserver.observe(greeting,{childList:true,characterData:true,subtree:true});
  const balance=byId('walletPoints');if(balance){new MutationObserver(syncPoints).observe(balance,{childList:true,characterData:true,subtree:true});syncPoints()}
  syncProfile();
}
function syncProfile(){
  const name=byId('customerGreeting')?.textContent||'Your account';
  const summary=byId('pcgProfileSummary');if(summary){summary.replaceChildren(make('strong',{},name),make('span',{},window.PCGStore?.user?.email||'Rewards member'))}
  const profile=window.PCGStore?.profile||{};
  const nameInput=byId('pcgSettingsName'),phoneInput=byId('pcgSettingsPhone');
  if(nameInput&&document.activeElement!==nameInput)nameInput.value=profile.full_name||window.PCGStore?.user?.user_metadata?.full_name||'';
  if(phoneInput&&document.activeElement!==phoneInput)phoneInput.value=profile.phone||window.PCGStore?.user?.user_metadata?.phone||'';
  const tier=byId('pcgOverviewTier');if(tier)tier.textContent=profile.tier||profile.membership_tier||'Member tier';
}
function syncPoints(){
  const value=byId('walletPoints')?.textContent||'--';
  const points=byId('pcgOverviewPoints'),header=byId('pcgHeaderPoints');
  if(points)points.textContent=value.replace(/\s*points?$/i,'');
  if(header)header.textContent=value.replace(/\s*points?$/i,'');
}
function buildAdminPages(){
  const dashboard=byId('adminDashboard');if(!dashboard)return;
  dashboard.hidden=false;
  dashboard.classList.add('pcg-admin-root');
  const generated=dashboard.querySelector('#generatedTokens')?.closest('.panel');
  if(generated)generated.dataset.adminModule='tokens';
  dashboard.querySelectorAll('.admin-columns>.panel').forEach(panel=>{
    if(panel.querySelector('#generateTokensForm'))panel.dataset.adminModule='tokens';
    else if(panel.querySelector('#createShopForm'))panel.dataset.adminModule='merchants';
  });
  dashboard.querySelectorAll('.admin-panel').forEach(panel=>{
    if(panel.querySelector('#batchesBody'))panel.dataset.adminModule='audit';
    else if(panel.querySelector('#shopsBody,#applicationsBody'))panel.dataset.adminModule='merchants';
  });
  dashboard.querySelectorAll('[data-admin-module]').forEach(node=>node.classList.add('pcg-admin-module'));
  const nav=dashboard.querySelector('.admin-realm-nav');
  if(nav){nav.classList.add('pcg-admin-tabs');nav.querySelectorAll('[data-admin-module-nav]').forEach(button=>{
    button.addEventListener('click',()=>navigate('#admin/'+button.dataset.adminModuleNav));
  })}
  outlet.append(dashboard);
}
function setNav(role,route){
  const routes=role==='admin'?adminRoutes:customerRoutes;
  navList.replaceChildren();
  navList.setAttribute('aria-label',role==='admin'?'Administrator navigation':'Customer navigation');
  const label=byId('pcgAppShell').querySelector('.pcg-nav-label');label.textContent=role==='admin'?'ADMIN CONTROL':'CUSTOMER SPACE';
  routes.forEach(item=>{
    const link=make('a',{href:'#'+item.id,class:'pcg-nav-link','aria-current':route===item.id?'page':'false'});
    link.append(make('span',{class:'pcg-nav-icon','aria-hidden':'true'},item.icon),make('span',{},item.label));
    navList.append(link);
  });
}
function showView(view){
  if(activeView===view)return;
  if(activeView){activeView.hidden=true;activeView.classList.remove('view-enter','view-exit')}
  activeView=view;
  if(!view)return;
  view.hidden=false;
  view.classList.remove('view-enter');
  if(!reducedMotion()){
    view.classList.add('view-enter');
    if(window.gsap)window.gsap.fromTo(view,{opacity:0,y:12,rotateX:1,transformPerspective:1200},{opacity:1,y:0,rotateX:0,duration:.45,ease:'power3.out',clearProps:'transform'});
  }
}
function navigate(hash){if(location.hash===hash)route();else location.hash=hash}
function dismissSplash(){
  const splash=byId('pcgSplash');if(!splash)return;
  splash.classList.add('pcg-splash-out');
  setTimeout(()=>splash.remove(),reducedMotion()?0:420);
}
function route(){
  if(!ready)return;
  let hash=location.hash||'#login';
  if(hash==='#home'||hash==='#')hash='#login';
  if(hash.startsWith('#pcg/customer/'))hash=({overview:'#dashboard',wallet:'#wallet',vouchers:'#vouchers',settings:'#settings'})[hash.split('/')[2]]||'#dashboard';
  if(hash.startsWith('#pcg/admin/'))hash=({command:'#admin',tokens:'#admin/tokens',merchants:'#admin/merchants',audit:'#admin/audit'})[hash.split('/')[2]]||'#admin';
  const role=document.body.dataset.role||'public';
  const gateway=byId('pcgPublicGateway'),customer=byId('customerDashboard'),admin=byId('adminDashboard');
  if(hash==='#admin-login'){
    shell.hidden=true;gateway.hidden=false;gateway.classList.add('pcg-admin-login-state');
    byId('customerAuthOverlay').hidden=true;
    if(byId('authOverlay').hidden)byId('loginOpen').click();
    return;
  }
  if(role==='admin'){
    if(hash==='#login'||hash==='#signup'||hash==='#admin-login'){navigate('#admin');return}
    const module=hash==='#admin/tokens'?'tokens':hash==='#admin/merchants'?'merchants':hash==='#admin/audit'?'audit':'command';
    gateway.hidden=true;shell.hidden=false;customer.hidden=true;admin.hidden=false;
    setNav('admin',module==='command'?'admin':'admin/'+module);
    byId('pcgRouteTitle').textContent=({command:'Executive command center',tokens:'Token forge & mint',merchants:'Merchant POS hub',audit:'Audit & activity'})[module];
    showView(admin);
    window.dispatchEvent(new CustomEvent('pcg:route',{detail:{role:'admin',page:module}}));
    return;
  }
  if(role==='customer'){
    if(hash==='#login'||hash==='#signup'||hash==='#admin'||hash.startsWith('#admin/')){navigate('#dashboard');return}
    const page=['wallet','vouchers','settings'].includes(hash.slice(1))?hash.slice(1):'dashboard';
    gateway.hidden=true;shell.hidden=false;customer.hidden=false;admin.hidden=true;
    setNav('customer',page);byId('pcgRouteTitle').textContent=({dashboard:'Overview',wallet:'Wallet & tokens',vouchers:'Rewards shop',settings:'User settings'})[page];
    showView(customer.querySelector('[data-route="'+page+'"]'));
    window.dispatchEvent(new CustomEvent('pcg:route',{detail:{role:'customer',page}}));
    return;
  }
  shell.hidden=true;customer.hidden=true;admin.hidden=true;gateway.hidden=false;gateway.classList.remove('pcg-admin-login-state');
  if(hash==='#signup')byId('showCustomerSignup')?.click();else byId('showCustomerLogin')?.click();
  byId('customerAuthOverlay').hidden=false;
  window.dispatchEvent(new CustomEvent('pcg:route',{detail:{role:'public',page:hash==='#signup'?'signup':'login'}}));
}
function showApp(){
  document.body.classList.add('pcg-spa');
  buildShell();
  ready=true;
  const requested=location.hash;
  if(!requested||requested==='#home')location.hash='#login';
  else route();
  dismissSplash();
}
document.addEventListener('DOMContentLoaded',()=>{
  showApp();
  window.addEventListener('hashchange',route);
  window.addEventListener('pcg:session-ready',route);
  window.addEventListener('pcg:auth',event=>{
    const role=event.detail?.role||'public';
    if(role==='customer')navigate('#dashboard');
    else if(role==='admin')navigate('#admin');
    else navigate('#login');
  });
  window.addEventListener('pcg:profile-updated',syncProfile);
  window.addEventListener('pcg:points-updated',syncPoints);
  window.PCGRouter={go:navigate,openAdmin:()=>navigate('#admin-login')};
});
})();
