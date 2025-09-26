'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import PartyList from '@/app/(with-nav)/parties/components/PartyList';

export default function Page() {
  return (
    <>
      <ContentWrapper withNav>
        <PartyList />
      </ContentWrapper>
    </>
  );
}
