import * as React from 'react';
import ContactUsBody from '../ContactUs/ContactUsBody';
import ContactUsWriteBody from '../ContactUsWrite/ContactUsWriteBody';
import ContactUsDetailBody from '../ContactUsDetail/ContactUsDetailBody';


function ContactUsPage({ userId, userName }: { userId: string; userName: string }) {
  const [page, setPage] = React.useState<'list'|'write'|'detail'>('list');
  const [inquiryId, setInquiryId] = React.useState<string | null>(null);

  const onNavigate = (p: string, props?: any) => {
    if (p === 'detail') setInquiryId(props?.inquiryId ?? null);
    setPage(p as any);
  };

  if (page === 'write') return <ContactUsWriteBody onNavigate={onNavigate} userId={userId} userName={userName} />;
  if (page === 'detail' && inquiryId) return <ContactUsDetailBody onNavigate={onNavigate} inquiryId={inquiryId} userId={userId} userName={userName} />;
  return <ContactUsBody onNavigate={onNavigate} userId={userId} />;
}

export default ContactUsPage