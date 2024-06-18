'use client';

import { Button } from '@nextui-org/react';
import { NextUIProvider } from "@nextui-org/react";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import useData from './use-data';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Chip, Avatar, Spinner } from "@nextui-org/react";

export default function Home() {

  return (
    <NextUIProvider>
      <Suspense>
        <div className='w-full h-screen flex flex-col items-center justify-center'>
          <div className="flex flex-col w-[300px] h-[300px] overflow-y-auto">
            <SearchList />
          </div>
        </div>
      </Suspense>
    </NextUIProvider>
  );
}

function SearchList() {

  const search = useSearchParams();

  const query = search?.get('term') || '';

  const { data, error, loading, refresh } = useData(query);

  if (loading) {
    return <div className='flex flex-row items-center justify-center h-[300px]'>
      <Spinner />
    </div>;
  }

  if (error) {
    return <div className='flex flex-row items-center justify-center h-[300px]'>
      <p>Error: {error.message}</p>
      <Button onClick={refresh}>Try again</Button>
    </div>;
  }

  return (
    <div>
      {data?.topics?.map((topic, index) => {

        const post = data.posts.find(post => post.topic_id === topic.id);

        return <Card key={index} className="max-w-[300px] group mb-2">
          <CardHeader className="flex gap-3">
            <div className='flex flex-row items-top justify-center'>
              <Avatar src={`https://cdn.linux.do/${post?.avatar_template.replace("{size}", "48")}`} alt={topic?.title} className='mr-2' />
              <div className="flex flex-1 flex-col">
                <Link isExternal href={`https://linux.do/t/topic/${post?.topic_id || ""}`} className="text-sm line-clamp-1 font-bold group-hover:underline">{topic?.title}</Link>
                <p className="text-sm text-default-500 line-clamp-1">
                  {topic?.tags.length ? topic?.tags.map((tag, index) => {
                    return (
                      <span key={index} className="mr-1 text-default-600">#{tag}</span>
                    )
                  }) : null}
                </p>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className='line-clamp-5 text-sm'>{post?.blurb}</p>
          </CardBody>
          <Divider />
          <CardFooter>
            <Chip className={"text-sm mr-1"}
              variant="flat"
              avatar={
                <Avatar
                  fallback="💬"
                  alt="nextui logo"
                />
              }
            >
              {topic?.posts_count}
            </Chip>
            <Chip className={"text-sm mr-1"}
              variant="flat"
              avatar={
                <Avatar
                  fallback="🩷"
                  alt="nextui logo"
                />
              }
            >
              {post?.like_count}
            </Chip>
            <Chip className={"text-sm mr-1"}
              variant="flat"
              avatar={
                <Avatar
                  fallback="↩️"
                  alt="nextui logo"
                />
              }
            >
              {topic?.reply_count}
            </Chip>
          </CardFooter>
        </Card>
      }) || <Card>
          <CardBody>
            <p>😕 No results found</p>
          </CardBody>
        </Card>}
    </div>
  );
}