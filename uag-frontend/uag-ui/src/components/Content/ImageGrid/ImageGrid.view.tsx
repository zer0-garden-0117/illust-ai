import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AspectRatio, Card, SimpleGrid, Text, Pagination, ActionIcon, Rating, Group, Fieldset, Image, Skeleton, Center, Loader } from '@mantine/core';
import { memo } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import classes from './ImageGrid.module.css';
import { RiHeartAdd2Line, RiDeleteBin6Line} from "react-icons/ri";
import AuthModal from '@/components/Header/AuthModal/AuthModal';
import { useNavigate } from '@/utils/navigate';
import { useUserTokenContext } from '@/providers/auth/userTokenProvider';

export type ImageData = {
  workId: string;
  mainTitle: string;
  titleImage: string;
  thumbnailImage: string;
  watermaskImage: string;
  date: string;
  isLiked: boolean | undefined;
  rating: number | undefined;
};

type ImageGridViewProps = {
  topIcon: React.ReactElement;
  title: string;
  isViewCount: boolean;
  isViewPagination: boolean;
  imageData: ImageData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRateChange: (workId: string, value: number) => void;
  onLikeChange: (workId: string, isCurrentlyLiked: boolean) => void;
  onDeleteClick: (workId: string) => void;
  isAuthenticated: boolean;
};

const CustomImage = ({ src, alt, index, onImageLoad }: { src: string; alt: string; index: number; onImageLoad: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    setShowSkeleton(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.01,
        rootMargin: '500px 0px' 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setShowSkeleton(false);
    onImageLoad();
  }, [onImageLoad]);

  const shouldDisplay = isVisible && isLoaded;

  return (
    <div ref={imgRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src={src}
        alt={alt}
        radius="md"
        loading="eager"
        onLoad={handleImageLoad}
        style={{
          width: '100%',
          height: '100%',
          opacity: shouldDisplay ? 1 : 0,
          transform: shouldDisplay ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 0.2s ease-in-out ${index * 0.03}s, transform 0.2s ease-in-out ${index * 0.03}s`
        }}
      />
      {showSkeleton && !shouldDisplay && (
        <Skeleton 
          width="100%" 
          height="100%" 
          radius="md" 
          visible={false}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      )}
    </div>
  );
};

const MemoizedImage = memo(CustomImage, (prevProps, nextProps) => prevProps.src === nextProps.src);

const MemoizedCard = memo(
  ({ imageData, index, onRateChange, onLikeChange, onDeleteClick, isAuthenticated, router, setLoginModalOpen, onImageLoad }: { 
    imageData: ImageData; 
    index: number; 
    onRateChange: (workId: string, value: number) => void; 
    onLikeChange: (workId: string, isCurrentlyLiked: boolean) => void; 
    onDeleteClick: (workId: string) => void; 
    isAuthenticated: boolean; 
    router: ReturnType<typeof useRouter>; 
    setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onImageLoad: () => void;
  }) => {
    const [localIsLiked, setLocalIsLiked] = useState(imageData.isLiked);
    const [localRating, setLocalRating] = useState(imageData.rating);
    const navigate = useNavigate();
    const { isAdmin } = useUserTokenContext();

    useEffect(() => {
      setLocalRating(imageData.rating);
    }, [imageData.rating]);

    useEffect(() => {
      setLocalIsLiked(imageData.isLiked);
    }, [imageData.isLiked]);

    const handleLikeClick = () => {
      if (!isAuthenticated) {
        setLoginModalOpen(true);
        return;
      }

      setLocalIsLiked(!localIsLiked);
      onLikeChange(imageData.workId, localIsLiked ?? false);
    };

    const handleRateClick = (rating: number) => {
      if (!isAuthenticated) {
        setLoginModalOpen(true);
        return;
      }
      setLocalRating(rating);
      onRateChange(imageData.workId, rating);
    };

    const handleDeleteClick = () => {
      onDeleteClick(imageData.workId)
    };

    const handleImageClick = () => {
      navigate(`/works/${imageData.workId}`);
    };

    return (
      <Card key={imageData.workId} p="md" radius="md" className={classes.card}>
        <AspectRatio ratio={1 / Math.sqrt(2)}>
          <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
            <MemoizedImage
              src={imageData.thumbnailImage}
              alt={imageData.mainTitle || "Image without title"}
              index={index}
              onImageLoad={onImageLoad}
            />
          </div>
        </AspectRatio>
        <Group style={{ width: '100%', overflow: 'hidden' }}>
          <div
            onClick={handleImageClick}
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <Text
              className={classes.title}
              mt={5}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {imageData.mainTitle}
            </Text>
          </div>
        </Group>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px' }}>
          <Rating value={localRating} onChange={handleRateClick} />
          <ActionIcon
            variant="transparent"
            color="gray"
            style={{
              color: localIsLiked ? 'hotpink' : 'gray',
              transition: 'color 0.2s ease',
              padding: 0,
              marginLeft: '8px',
            }}
            onClick={handleLikeClick}
          >
            <RiHeartAdd2Line />
          </ActionIcon>
          { isAdmin && (
            <ActionIcon
            variant="transparent"
            color="gray"
            onClick={handleDeleteClick}
          >
            <RiDeleteBin6Line />
          </ActionIcon>
        )}
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => prevProps.imageData.rating === nextProps.imageData.rating && prevProps.imageData.isLiked === nextProps.imageData.isLiked
);
MemoizedCard.displayName = 'MemoizedCard';

export const ImageGridView = memo(function ImageGridViewComponent({
  topIcon,
  title,
  isViewCount,
  isViewPagination,
  imageData,
  currentPage,
  totalPages,
  totalCount,
  loading,
  onPageChange,
  onLikeChange,
  onRateChange,
  onDeleteClick,
  isAuthenticated
}: ImageGridViewProps): JSX.Element {
  const t = useTranslations("imageGrid");
  const locale = useLocale()
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const fullPath = `${pathname}?${searchParams.toString()}`;

  // スクロールイベントで位置をリアルタイムに保存
  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!loading) {
        sessionStorage.setItem(`scrollPosition-${fullPath}`, window.scrollY.toString());
      } 
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, loading]);

  // 全画像がロードされたときの処理
  useEffect(() => {
    if (imageData.length > 0) {
      setInitialLoading(false)
      const savedPosition = sessionStorage.getItem(`scrollPosition-${fullPath}`);
      const targetPosition = savedPosition ? parseInt(savedPosition, 10) : 0;
      setTimeout(() => {
        window.scrollTo(0, targetPosition);
      }, 100);
    }
  }, [imagesLoaded, pathname, imageData.length, initialLoading]);

  const handleImageLoad = () => {
    setImagesLoaded((loaded) => loaded + 1);
  };

  const cards = imageData.map((data, index) => (
    <MemoizedCard
      key={data.workId}
      imageData={data}
      index={index}
      onRateChange={onRateChange}
      onLikeChange={onLikeChange}
      onDeleteClick={onDeleteClick}
      isAuthenticated={isAuthenticated}
      router={router}
      setLoginModalOpen={setLoginModalOpen}
      onImageLoad={handleImageLoad}
    />
  ));

  if (initialLoading) {
    return (
      <Center style={{ height: '50vh', padding: '20px' }}>
        <Loader color="black" size="xs" />
      </Center>
    );
  }

  return (
    <>
        {!loading && (
          <>
            <Fieldset
              ml={-5}
              variant="unstyled"
              legend={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {React.cloneElement(topIcon, {
                    style: {
                      marginRight: '8px',
                      position: 'relative',
                      fontSize: '20px',
                      color: "#fd7e14",
                      top: '-2px',
                    }
                  })}
                  <Text
                    variant="gradient"
                    gradient={{ from: '#fd7e14', to: 'hotpink', deg: 90 }}
                    fw={200}
                    size='md'
                  >
                    {title} {isViewCount && `( ${totalCount} ${t("item")}${totalCount >= 2 && locale == "en" ? "s" : ""} )`}
                  </Text>
                </div>
              }
            />
          </>
        )}

        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>
          {cards}
        </SimpleGrid>
        {!loading && totalPages > 1 && isViewPagination && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              value={currentPage}
              onChange={onPageChange}
              total={totalPages}
              mt="lg"
              radius="xl"
              withEdges
              color="gray"
              size="sm"
            />
          </div>
        )}

      <AuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        isLogin={true}
      />
    </>
  );
});