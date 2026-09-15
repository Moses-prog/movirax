'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-medium bg-background/60 dark:bg-default-100/50 backdrop-blur-xl">
        <CardHeader className="flex flex-col items-center gap-2 pb-0 pt-8">
          <div className="flex size-16 items-center justify-center rounded-full bg-danger/10 text-danger mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
        </CardHeader>
        <CardBody className="py-6 text-center text-default-500">
          <p>We encountered an unexpected error while processing this request in the admin panel.</p>
          {error?.message && (
            <div className="mt-4 rounded-lg bg-default-100 p-3 text-xs font-mono text-default-600 text-left overflow-auto max-h-32">
              {error.message}
            </div>
          )}
        </CardBody>
        <CardFooter className="flex gap-4 justify-center pb-8 pt-0">
          <Button 
            variant="flat" 
            startContent={<Home size={18} />}
            as={Link}
            href="/admin"
          >
            Dashboard
          </Button>
          <Button 
            color="danger" 
            startContent={<RefreshCcw size={18} />}
            onPress={() => reset()}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
