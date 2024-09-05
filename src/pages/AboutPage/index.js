import ReactMarkdown from 'react-markdown';
import cn from 'classnames';

import s from './s.module.css';
import { useEffect } from 'react';

const markdownText = `
### About Fil+

Filecoin Plus is a layer of social trust on top of the Filecoin Network to help incentivize the storage of real data. Root key-holders, allocators, clients, and storage providers, interact through the allocation and spending of DataCap. You can read more about the Fil+ program [here](https://docs.filecoin.io/store/filecoin-plus/).

Clients looking to utilize storage on the network apply to receive DataCap from Allocators, which can be used to incentivize storage providers to make storage deals. Allocators are community-elected trustees responsible for allocating DataCap to parties storing useful data on the network. Storage Providers that receive DataCap receive a 10x boost to their quality-adjusted power for the storage space offered in that deal, which increases their block reward share in the network. This creates a mechanism that incentivizes all participants to make Filecoin more useful.

The goal of this site is to provide metrics, insights, and audit accountability tools for the Filecoin Plus community. You can see health statistics of the overall program, along with tables of data to track the interactions between the stakeholders (Allocators, Clients, and Storage Providers). This site was created by Digital M.O.B. in collaboration with Protocol Labs and the Filecoin Foundation providing development grants.

### Dashboard:

You can check some quick statistics and metrics about the Fil+ program, such as number of allocators, clients, and storage providers. You can also see number and size of deals, along with quantity of DataCap allocated to allocators.

### Allocators:

*List of allocators and info about them*

Search for a allocator by ID or Address. Audit details like number & address of clients verified by each allocator, along with DataCap allocated vs available by the allocator

Are you a client looking for a Allocator? [https://plus.fil.org/](https://plus.fil.org/)

Interested in learning more about allocators or becoming one? Check out this blog about elections, and learn more in our [GitHub repo](https://github.com/filecoin-project/allocator-governance)

### Clients

*Metrics about verified clients*

Search for clients by Verified Client ID, Address, or Allocator ID. Track number of verified deals by a client, along with discrete number of storage providers that client is working with, and client's DataCap available vs allocated.
Note: clients that receive automatic DataCap allocations from the [verify.glif.io](https://verify.glif.io) site maintained by the Infinite Scroll allocator are marked as "Glif auto verified".

Are you a client hoping to get verified and receive DataCap? [https://plus.fil.org/](https://plus.fil.org/)

### Storage Providers

*Active storage providers storing verified data*

Find a storage provider by ID. See number of verified deals per storage provider ID, number of verified clients per storage provider, total DataCap received, and average deal details.

Are you a storage provider hoping to store verified data and increase your quality-adjusted power? Find clients in #fil-deal-market in Filecoin Slack, and add yourself to the Fil+ storage provider registry [here](https://github.com/filecoin-project/filecoin-plus-client-onboarding/blob/main/miners.md)!

### Statistics

*Metrics and statistics for overall activity within the Fil+ program*

Statistics here are calculated through data available in GitHub and on chain.

Looking for more dashboards about the overall Filecoin Network? Check out [filplus.info](https://filplus.info/) and [this resource page](https://docs.filecoin.io/reference/#network-status).

Have a question or feedback on this site? Contact us or start an Issue in our GitHub!

### API

If you need to query our APIs for specific data, you can find the documentation [here](https://documenter.getpostman.com/view/131998/Tzsim4NU#intro).

`;

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About';
  }, []);

  return (
    <div className="container">
      <h2 className="h2">About Fil+ Dashboard</h2>
      <ReactMarkdown
        children={markdownText}
        className={cn(s.wrap)}
        components={{
          h3: ({ node, ...props }) => (
            <h3 {...props} className={cn('h3', s.h3)} />
          ),
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      />
    </div>
  );
}
