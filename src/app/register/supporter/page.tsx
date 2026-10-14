import { getRegionConfig } from '@/lib/config';
import RegisterSupporterForm from './RegisterSupporterForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Apply as Supporter | With You Kerala',
  description: 'Join Kerala’s verified companion network and start earning.',
};

export default async function RegisterSupporterPage() {
  const config = await getRegionConfig('KL');
  return <RegisterSupporterForm config={config} />;
}
