import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://bkinchin:K3xSMe2eksuFGaea@cluster0.mcggdut.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollections = db.collection("meetups");

  const meetups = await meetupsCollections.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  /// fetch data fir a single meetup
  const client = await MongoClient.connect(
    "mongodb+srv://bkinchin:K3xSMe2eksuFGaea@cluster0.mcggdut.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollections = db.collection("meetups");

  const selectedMeetup = await meetupsCollections.findOne({
    _id: new ObjectId(meetupId),
  });
  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
};

// export async function getStaticProps(context) {
//   /// fetch data fir a single meetup

//   const meetupId = context.params.meetupId;
//   console.log("hi");
//   console.log(meetupId);
//   return {
//     props: {
//       meetupData: {
//         image:
//           "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/North_Congregational_Church._36520_West_Twelve_Mile_Road_Farmington_Hills%2C_Michigan_-_panoramio.jpg/1920px-North_Congregational_Church._36520_West_Twelve_Mile_Road_Farmington_Hills%2C_Michigan_-_panoramio.jpg",
//         id: meetupId,
//         title: "A first meet up!",
//         address: "5 Brown street, Bronte",
//         description: "The meetup description",
//       },
//     },
//   };
// }

export default MeetupDetails;
