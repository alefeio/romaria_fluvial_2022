import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Sidebar } from '../components/Sidebar';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import * as prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import ImageSlider from '../components/ImageSlider';
import { RiCalendar2Line } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { HeadSite } from '../components/Head';

type Post = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  excerpt: string;
  updatedAt: string;
  destaque: boolean;
};

type Banner = {
  description: string;
  image: string;
};

type Oracao = {
  title: string;
  description: string;
  content: string;
};

type Agenda = {
  event: string;
  datestart: string;
  dateend: string;
};

interface PostsProps {
  posts: Post[];
  banners: Banner[];
  oracao: Oracao;
  agenda: Agenda[];
  agendaTodos: Agenda[];
}

const deviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

export default function Home({ posts, banners, oracao, agenda, agendaTodos }: PostsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModal, setIsModal] = useState('');

  const newBanners = banners.map((banner: any) => {
    return {
      image: banner.image.url,
    };
  });

  console.log('agenda', agenda);

  useEffect(() => {}, []);

  return (
    <>
      <HeadSite />
      <Box>
        {isModal === 'oracao' ? (
          <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Heading color="blue.500" fontSize={'2xl'} fontFamily={'body'}>
                  Oração do Dia
                </Heading>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text fontSize="xl" dangerouslySetInnerHTML={{ __html: oracao.title }} />
                <Text dangerouslySetInnerHTML={{ __html: oracao.content }} />
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Fechar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ) : (
          <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Heading color="blue.500" fontSize={'2xl'} fontFamily={'body'}>
                  Agenda do Círio
                </Heading>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {agendaTodos.map((a) => (
                  <Stack mb="2" key={a.event}>
                    <Flex justify="flex-start" align="center">
                      <Icon as={RiCalendar2Line} color="gray.500" mr="2" />
                      <Heading color="gray.500" fontSize={'sm'}>
                        {a.datestart}
                      </Heading>
                      {a.dateend && (
                        <Heading color="gray.500" fontSize={'sm'} m="2">
                          a
                        </Heading>
                      )}
                      {a.dateend && (
                        <Heading color="gray.500" fontSize={'sm'}>
                          {a.dateend}
                        </Heading>
                      )}
                    </Flex>
                    <Heading color="gray.700" fontSize={'md'}>
                      {a.event}
                    </Heading>
                  </Stack>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Fechar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        <Box w={'full'} boxShadow={'xl'} alignContent="center" justifyContent="center" mb={10} bg="blue.600">
          <ImageSlider slides={newBanners} mt="auto" />
        </Box>

        <Flex w="100%" maxWidth={1480} p="6" mx="auto">
          <Sidebar />

          <Box flex="1" borderRadius={8}>
            <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={10} mb={20}>
              {/* <GridItem
              w={'full'}
              bg="gray.900"
              boxShadow={'xl'}
              rounded={'md'}
              alignContent="center"
              justifyContent="center"
              overflow={'hidden'}
            >
              <Link href={`/`}>
                <a>
                  <Box bg={'gray.100'} pos={'relative'}>
                    <Image src="/assets/images/promocao.jpg" width="100%" />
                  </Box>
                </a>
              </Link>
            </GridItem> */}
              {/* <GridItem
                w={'full'}
                bg="white"
                boxShadow={'xl'}
                rounded={'md'}
                alignContent="center"
                justifyContent="center"
                overflow={'hidden'}
              >
                <Link href={`/ingresso`}>
                  <a>
                    <Box bg={'gray.100'} pos={'relative'}>
                      <Image src="/assets/images/compra_online.jpg" width="100%" />
                    </Box>
                  </a>
                </Link>
              </GridItem> */}
              <GridItem
                w={'full'}
                bg="white"
                boxShadow={'xl'}
                rounded={'md'}
                alignContent="center"
                justifyContent="center"
                overflow={'hidden'}
              >
                <Link href={`/reserva/create`}>
                  <a>
                    <Box bg={'gray.100'} pos={'relative'}>
                      <Image src="/assets/images/reserva.jpg" width="100%" />
                    </Box>
                  </a>
                </Link>
              </GridItem>
              <GridItem
                w={'full'}
                bg="white"
                boxShadow={'xl'}
                rounded={'md'}
                alignContent="center"
                justifyContent="center"
                overflow={'hidden'}
              >
                <Box bg={'gray.100'} pos={'relative'} onClick={() => signIn('cognito')} cursor="pointer">
                  <Image src="/assets/images/cadastro.jpg" width="100%" />
                </Box>
              </GridItem>
            </Grid>

            <Flex mb={20} gap={10} direction={['column', 'row']}>
              <Flex
                w={'full'}
                direction={['column', 'row']}
                bg="white"
                boxShadow={'xl'}
                rounded={'md'}
                alignContent="center"
                justifyContent="space-between"
                overflow={'hidden'}
              >
                <Box bg={'gray.100'} pos={'relative'} w={['100%', '350px']}>
                  <Link href={`/`}>
                    <a>
                      <Image src="assets/images/oracao.jpg" w="100%" />
                    </a>
                  </Link>
                </Box>
                <Stack p={6} flex="1">
                  <Flex direction="column" justify="flex-end">
                    <Heading color="blue.500" fontSize={'2xl'} fontFamily={'body'} mb="2">
                      Oração do Dia
                    </Heading>
                    <Heading color="gray.700" fontSize={'md'}>
                      {oracao.title}
                    </Heading>
                    <Text color={'gray.500'} mb="4">
                      {oracao.description}
                    </Text>
                    <Flex justify="flex-end">
                      <Button
                        onClick={() => {
                          onOpen();
                          setIsModal('oracao');
                        }}
                        border="0"
                        bg="blue.500"
                        color="blue.50"
                        borderRadius={4}
                        px="4"
                        py="1"
                      >
                        Ler mais
                      </Button>
                    </Flex>
                  </Flex>
                </Stack>
              </Flex>
              <Flex
                w={'full'}
                direction={['column', 'row']}
                bg="white"
                boxShadow={'xl'}
                rounded={'md'}
                alignContent="center"
                justifyContent="space-between"
                overflow={'hidden'}
              >
                <Box bg={'gray.100'} pos={'relative'} w={['100%', '350px']}>
                  <Link href={`/`}>
                    <a>
                      <Image src="assets/images/agenda-cirio.jpg" w="100%" />
                    </a>
                  </Link>
                </Box>
                <Stack p={6} flex="1">
                  <Heading color="blue.500" fontSize={'2xl'} fontFamily={'body'} mb="2">
                    Agenda do Círio
                  </Heading>

                  <Box>
                    {agenda.map((a) => (
                      <Stack mb="2" key={a.event}>
                        <Flex>
                          <Icon as={RiCalendar2Line} color="gray.500" mr="2" />
                          <Heading color="gray.500" fontSize={'sm'}>
                            {a.datestart}
                          </Heading>
                        </Flex>
                        <Heading color="gray.700" fontSize={'md'}>
                          {a.event}
                        </Heading>
                      </Stack>
                    ))}
                    <Flex justify="flex-end">
                      <Button
                        onClick={() => {
                          onOpen();
                          setIsModal('agenda');
                        }}
                        border="0"
                        bg="blue.500"
                        color="blue.50"
                        borderRadius={4}
                        px="4"
                        py="1"
                      >
                        Ver todos
                      </Button>
                    </Flex>
                  </Box>
                </Stack>
              </Flex>
            </Flex>

            <Breadcrumb borderBottom="4px" borderColor="blue.500" color="blue.500" marginBottom={10}>
              <BreadcrumbItem display="flex" justifyContent="space-between">
                <Link href="" passHref>
                  {' '}
                </Link>
                <Link href="/posts" passHref>
                  <BreadcrumbLink fontSize="3xl">Destaques</BreadcrumbLink>
                </Link>
                <Link href="" passHref>
                  {' '}
                </Link>
              </BreadcrumbItem>
            </Breadcrumb>

            <Grid templateColumns={['repeat(1, 1fr)', 'repeat(4, 1fr)']} gap={10} mb={10}>
              {posts.map((post) => (
                <GridItem
                  key={post.slug}
                  w={'full'}
                  bg="blue.600"
                  boxShadow={'xl'}
                  rounded={'md'}
                  alignContent="center"
                  justifyContent="center"
                  overflow={'hidden'}
                >
                  <Link href={`/posts/${post.slug}`}>
                    <a>
                      <Box>
                        <Image src={post.image} width="100%" />
                      </Box>
                      <Stack p={6}>
                        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                          <Text color="whiteAlpha.500">{post.updatedAt}</Text>
                        </Stack>
                        <Heading color="whiteAlpha.900" fontSize={'2xl'} fontFamily={'body'}>
                          {post.title}
                        </Heading>
                        <Text color="whiteAlpha.800">{post.subtitle}</Text>
                      </Stack>
                    </a>
                  </Link>
                </GridItem>
              ))}
            </Grid>

            <Flex align="flex-end" justify="flex-end" mb={20}>
              <Box bg="blue.500" color="blue.50" borderRadius={4} px="8" py="2">
                <Link href="/posts">
                  <a>+ posts</a>
                </Link>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient();

  const responsePosts = await client.get({
    predicates: prismic.predicate.at('document.type', 'posts'),
    lang: 'pt-br',
    orderings: {
      field: 'document.last_publication_date',
      direction: 'desc',
    },
    pageSize: 4,
  });

  const posts = responsePosts.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      subtitle: RichText.asText(post.data.subtitle),
      image: post.data.image.url,
      excerpt: post.data.content.find((content: any) => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      destaque: post.data.destaque,
    };
  });

  const responseBanners = await client.get({
    predicates: prismic.predicate.at('document.type', 'banner'),
    lang: 'pt-br',
    orderings: {
      field: 'document.last_publication_date',
      direction: 'desc',
    },
  });

  const banners = responseBanners.results.map((banner) => {
    return {
      image: banner.data.image,
      description: RichText.asText(banner.data.description),
    };
  });

  const responseOracao = await client.getFirst({
    predicates: prismic.predicate.at('document.type', 'oracao-do-dia'),
    lang: 'pt-br',
    orderings: {
      field: 'document.last_publication_date',
      direction: 'desc',
    },
  });

  const oracao = {
    title: RichText.asText(responseOracao.data.title),
    description: RichText.asText(responseOracao.data.description),
    date: new Date(responseOracao.data.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    content: RichText.asHtml(responseOracao.data.content),
  };

  const responseAgenda = await client.get({
    predicates: prismic.predicate.at('document.type', 'agenda-do-cirio'),
    lang: 'pt-br',
    pageSize: 3,
    orderings: {
      field: 'my.agenda-do-cirio.datestart',
      direction: 'asc',
    },
  });

  const responseAgendaTodos = await client.get({
    predicates: prismic.predicate.at('document.type', 'agenda-do-cirio'),
    lang: 'pt-br',
    orderings: {
      field: 'my.agenda-do-cirio.datestart',
      direction: 'asc',
    },
  });

  const agenda = responseAgenda.results.map((post) => {
    return {
      event: RichText.asText(post.data.event),
      datestart: new Date(post.data.datestart).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      dateend: new Date(post.data.dateend).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  const agendaTodos = responseAgendaTodos.results.map((post) => {
    return {
      event: RichText.asText(post.data.event),
      datestart: new Date(post.data.datestart).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      dateend:
        new Date(post.data.dateend).toLocaleDateString('pt-BR', { year: 'numeric' }) !== '1969' ||
        new Date(post.data.dateend).toLocaleDateString('pt-BR', { year: 'numeric' }) !== '1970'
          ? new Date(post.data.dateend).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : null,
    };
  });

  return {
    props: {
      posts,
      banners,
      oracao,
      agenda,
      agendaTodos,
    },
    revalidate: 60 * 60,
  };
};
