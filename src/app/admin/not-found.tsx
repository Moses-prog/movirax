'use client';

import { Search, Home, ArrowLeft } from 'lucide-react';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNotFound() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-medium bg-background/60 dark:bg-default-100/50 backdrop-blur-xl">
        <CardHeader className="flex flex-col items-center gap-2 pb-0 pt-8">
          <div className="flex size-16 items-center justify-center rounded-full bg-default-100 text-default-500 mb-4">
            <Search size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
        </CardHeader>
        <CardBody className="py-6 text-center text-default-500">
          <p>The admin page you are looking for doesn't exist or has been moved.</p>
        </CardBody>
        <CardFooter className="flex gap-4 justify-center pb-8 pt-0">
          <Button 
            variant="flat" 
            startContent={<ArrowLeft size={18} />}
            onPress={() => router.back()}
          >
            Go Back
          </Button>
          <Button 
            color="danger" 
            startContent={<Home size={18} />}
            as={Link}
            href="/admin"
          >
            Admin Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
