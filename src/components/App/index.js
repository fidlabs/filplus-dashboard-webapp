import { lazy, Suspense, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Spinner } from 'components/Spinner';
import { Header } from 'components/Header';
import DashboardPageDev from 'components/DashboardPageDev';
import ClientAllocationPage from 'components/ClientAllocationPage';
import ClientDDODealsPage from 'components/ClientDDODealsPage';
import { Toaster } from 'sonner';

const DashboardPage = lazy(() => import('components/DashboardPage'));
const DashboardPageV2 = lazy(() => import('components/DashboardPageV2'));
const MsigMessagePage = lazy(() => import('components/MsigMessagePage'));

const AboutPage = lazy(() => import('components/AboutPage'));

const NotariesPage = lazy(() => import('components/NotariesPage'));
const NotaryPage = lazy(() => import('components/NotaryPage'));
const NotaryAllocationsOverview = lazy(() =>
  import('components/NotaryAllocationsOverview')
);

const LargeDataSetsPage = lazy(() => import('components/LargeDatasetsPage'));

const ClientsPage = lazy(() => import('components/ClientsPage'));
const ClientPage = lazy(() => import('components/ClientPage'));
const ClientBreakdownPage = lazy(() =>
  import('components/ClientBreakdownPage')
);

const MinersPage = lazy(() => import('components/MinersPage'));
const MinerPage = lazy(() => import('components/MinerPage'));


const ComplianceDashboardPage = lazy(() => import('components/ComplianceDashboard'));

function App() {
  return (
    <>
      <Header />
      <main>
        <Toaster position="top-right" toastOptions={{
          duration: 2000,
        }} />
        <Suspense
          fallback={
            <div style={{ margin: 'auto' }}>
              <Spinner width={40} height={40} />
            </div>
          }
        >
          <Switch>
            <Route exact path="/" component={DashboardPageV2} />
            <Route exact path="/dash-old" component={DashboardPage} />
            <Route exact path="/dev" component={DashboardPageDev} />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/notaries" component={NotariesPage} />
            <Route exact path="/notaries/:notaryID" component={NotaryPage} />
            <Route
              exact
              path="/notaries/:notaryID/overview"
              component={NotaryAllocationsOverview}
            />
            <Route exact path="/large-datasets" component={LargeDataSetsPage} />
            <Route exact path="/clients" component={ClientsPage} />
            <Route exact path="/clients/:clientID" component={ClientPage} />
            <Route
              exact
              path="/clients/:clientID/breakdown"
              component={ClientBreakdownPage}
            />
            <Route
              exact
              path="/clients/:clientID/allocations"
              component={ClientAllocationPage}
            />
            <Route
              exact
              path="/compliance-data-portal"
              component={ComplianceDashboardPage}
            />
            <Route
              exact
              path="/clients/:clientID/ddo-deals"
              component={ClientDDODealsPage}
            />
            <Route exact path="/storage-providers" component={MinersPage} />
            <Route
              exact
              path="/storage-providers/:minerID"
              component={MinerPage}
            />
            <Route
              exact
              path="/msig-message/:msigCid"
              component={MsigMessagePage}
            />

            <Redirect to="/" />
          </Switch>
        </Suspense>
      </main>
    </>
  );
}

export default App;
