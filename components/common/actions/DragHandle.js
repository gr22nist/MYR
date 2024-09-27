import dynamic from 'next/dynamic';

const DragHandle = dynamic(() => import('./DragHandleComponent'), { ssr: false });

export default DragHandle;
