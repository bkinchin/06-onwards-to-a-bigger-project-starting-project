import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A first Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/North_Congregational_Church._36520_West_Twelve_Mile_Road_Farmington_Hills%2C_Michigan_-_panoramio.jpg/1920px-North_Congregational_Church._36520_West_Twelve_Mile_Road_Farmington_Hills%2C_Michigan_-_panoramio.jpg",
    address: "Some address 5 Brown St, Bronte 2024",
    description: "This is a first meetup",
  },
  {
    id: "m2",
    title: "A second Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/North_Congregational_Church._36520_West_Twelve_Mile_Road_Farmington_Hills%2C_Michigan_-_panoramio.jpg/1920px-North_Congregational_Church._36520_West_Twelve_Mile_Road_Farmington_Hills%2C_Michigan_-_panoramio.jpg",
    address: "Some address 12 Stafford, Double Bay, 2028",
    description: "This is a second meetup",
  },
];

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups}></MeetupList>;
    </>
  );
};

// export const getServerSideProps = async (context) => {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export const getStaticProps = async () => {
  //fetch dat from api
  const client = await MongoClient.connect(
    "mongodb+srv://bkinchin:K3xSMe2eksuFGaea@cluster0.mcggdut.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollections = db.collection("meetups");

  const meetups = await meetupsCollections.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
};

export default HomePage;
