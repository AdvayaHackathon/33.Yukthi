import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const allData = [
  {
    title: "The Lunar Connection",
    description:
      "Tides are primarily caused by the gravitational pull of the Moon and, to a lesser extent, the Sun. Interestingly, the Moon’s influence is about twice as strong as the Sun's, despite being much smaller, due to its closer proximity to Earth. This celestial dance gives us the rhythmic rise and fall of sea levels every day.",
    image:
      "https://th.bing.com/th/id/OIP.P6syAhr6Zsw8MigI-R4BcwHaE8?rs=1&pid=ImgDetMain",
  },
  {
    title: "Two Tides a Day",
    description:
      "Most coastal areas experience two high tides and two low tides daily. The time between high tides is approximately 12 hours and 25 minutes, as the Moon’s position shifts slightly each day, causing tides to follow suit.",
    image:
      "https://geographyhost.com/wp-content/uploads/2022/05/ocean-g21bcfa2c3_640.jpg",
  },
  {
    title: "Spring Tides vs. Neap Tides",
    description:
      "When the Earth, Moon, and Sun align during a full or new Moon, their combined gravitational forces create spring tides, resulting in extremely high high tides and very low low tides. In contrast, during the first and third quarters of the Moon, neap tides occur, producing milder tidal differences.",
    image:
      "https://metro.co.uk/wp-content/uploads/2017/10/758363881.jpg?quality=90&strip=all&w=1200&h=630&crop=1",
  },
  {
    title: "Bay of Fundy Marvel",
    description:
      "The Bay of Fundy in Canada boasts the highest tidal range in the world. Here, tides can rise and fall by an astounding 16 meters (52 feet), enough to completely transform the landscape twice a day!",
    image:
      "https://media-cdn.tripadvisor.com/media/photo-s/06/43/f9/88/bay-of-fundy.jpg",
  },
  {
    title: "Tidal Bores - Nature's Wave Riders",
    description:
      "In some rivers, incoming tides create a powerful wave that travels upstream, called a tidal bore. The Qiantang River in China features one of the most spectacular bores, drawing surfers and spectators from around the world.",
    image:
      "https://raftingcanada.ca/wp-content/uploads/2016/01/portal-rafting-02-2000x650.jpg",
  },
  {
    title: "A Timekeeper for Ancient Civilizations",
    description:
      "For centuries, tides served as a natural clock for ancient seafarers and coastal dwellers. They tracked tidal patterns to predict the best times for fishing, sailing, and even religious ceremonies.",
    image:
      "https://canonica.ai/images/thumb/a/a4/Detail-53582.jpg/500px-Detail-53582.jpg",
  },
  {
    title: "Ecosystem Engineers",
    description:
      "Tides play a vital role in coastal ecosystems, helping to mix nutrients and oxygen in shallow waters. This movement sustains a diverse range of marine life, from tiny plankton to massive whales.",
    image:
      "https://www.americanoceans.org/wp-content/uploads/2021/06/Loggerhead-in-wild-nature-habitat-.jpg",
  },
  {
    title: "Fishermen’s Secret Weapon",
    description:
      "Tidal knowledge is invaluable for fishermen, as many fish and marine species move with the tides. Understanding the flow of tides often means the difference between a good catch and an empty net.",
    image:
      "https://media.indiatimes.in/media/content/2015/Jan/telegraph%20co%20uk_1420697566.jpg",
  },
  {
    title: "Slowing Down Earth's Spin",
    description:
      "Over millions of years, the Moon’s gravitational pull has acted like a brake on Earth’s rotation, gradually increasing the length of a day. Around 1.4 billion years ago, a day lasted only about 18 hours!",
    image:
      "https://i5.walmartimages.com/asr/02f35043-5084-4a47-a432-da1e0023c30d_1.311f6e02d93900a20c0a73e1f7e033d2.jpeg",
  },
  {
    title: "Earthquakes and Tidal Forces",
    description:
      "While it might sound surprising, extreme tides can sometimes trigger underwater earthquakes by exerting pressure on tectonic plates. This rare phenomenon showcases the immense power of tidal forces.",
    image:
      "https://www.digitaltrends.com/wp-content/uploads/2021/09/earth-by-inspiration4-spacex.jpeg?resize=1200%2C630&p=1",
  },
  {
    title: "The Predictable Power Source",
    description:
      "Unlike solar and wind energy, tidal energy is incredibly predictable because tidal patterns are governed by the Moon’s orbit. This makes it one of the most reliable renewable energy sources for future power generation.",
    image:
      "https://hakaimagazine.com/wp-content/uploads/header-marine-energy.jpg",
  },
  {
    title: "Nature’s Turbines",
    description:
      "Tidal turbines resemble underwater wind turbines and are used to harness the kinetic energy of moving tides. These devices operate silently below the ocean surface, leaving the scenic beauty of coastlines untouched.",
    image:
      "https://th.bing.com/th/id/R.eae3b2980c53bb39715fa4646cd8c33d?rik=zNAUSzXd4NoJSA&riu=http%3a%2f%2fgreen-blog.org%2fuploads%2fmonthly_2015_04%2fc1d202acaf49f14bbc91e83fe69d03f8.jpg.b546cfea38eeffd640118b408aa8fdfa.jpg&ehk=gzy5tsNXTFUXba58lj2FyHnAuhp2Yz6lgjMeTcWSuq8%3d&risl=&pid=ImgRaw&r=0",
  },
  {
    title: "France Leads the Way",
    description:
      "The Rance Tidal Power Station in France, built in 1966, was the world’s first tidal power plant. Even decades later, it remains a pioneering example of how the ocean’s energy can be harnessed sustainably.",
    image:
      "https://spinwave.tech/wp-content/uploads/2022/05/La-Rance-tidal-power-station.jpg",
  },
  {
    title: "The Global Energy Giant",
    description:
      "Scientists estimate that tidal energy has the potential to generate over 120 gigawatts of power globally. That’s enough energy to supply electricity to tens of millions of homes, reducing dependence on fossil fuels.",
    image:
      "https://th.bing.com/th/id/R.1ad2c9f0a62e48f5b59a7e962274c5a9?rik=iA7rFLRkck%2f3qQ&riu=http%3a%2f%2fcumminsca.com%2fsites%2fdefault%2ffiles%2f2022-07%2felectric_powerlines_moving_snapshot_m_1.jpg&ehk=6wgOOGQNC6I7PA1wZh1uTpxudzJjO16GNwgsOvK6P5E%3d&risl=&pid=ImgRaw&r=0",
  },
  {
    title: "Environmentally Friendly",
    description:
      "Tidal energy is a zero-emission energy source. Unlike coal or gas, it doesn’t release any greenhouse gases, making it a crucial player in combating climate change.",
    image:
      "https://th.bing.com/th/id/OIP.yfW3AYKXUXW_xE6jxaEj8wHaDt?rs=1&pid=ImgDetMain",
  },
  {
    title: "High Efficiency Levels",
    description:
      "Tidal turbines have efficiency rates of up to 80%, outperforming many other renewable technologies like wind and solar. This efficiency is due to the dense nature of water, which can generate more power than air at the same speed.",
    image:
      "https://energyworld360.com/wp-content/uploads/2020/08/Tidal-Power-1024x741.jpg",
  },
  {
    title: "Energy Day and Night",
    description:
      "Tidal energy works around the clock, unaffected by weather or sunlight. This makes it a consistent source of power, particularly for coastal regions with strong tidal activity.",
    image:
      "https://th.bing.com/th/id/OIP.9A9W5VWQK4qtjSZ3bg7eFwHaEo?w=1920&h=1200&rs=1&pid=ImgDetMain",
  },
  {
    title: "Protecting Marine Life",
    description:
      "Modern tidal energy projects are designed with eco-friendly considerations, such as slow-moving blades to minimize harm to marine animals and sensors to detect their presence.",
    image:
      "https://th.bing.com/th/id/OIP.IsLqyjJdwRYO9ur9lbCZCAHaEo?rs=1&pid=ImgDetMain",
  },
  {
    title: "Expanding Opportunities",
    description:
      "Countries like the UK, Canada, and South Korea are investing heavily in tidal energy projects, recognizing its potential to revolutionize their energy landscapes.",
    image:
      "https://th.bing.com/th/id/OIP.WSsKiw70_a-hgFBdFVj_5QAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "The Future of Coastal Cities",
    description:
      "As coastal populations grow, tidal energy could provide a localized, sustainable energy solution for cities near the sea, ensuring cleaner energy while reducing reliance on imported fossil fuels.",
    image:
      "https://lp-cms-production.imgix.net/image_browser/Mumbai_nightlife_S.jpg?auto=format&fit=crop&q=40&sharp=10&vib=20&ixlib=react-8.6.4",
  },
];

export default function FormalDetailsScreen() {
  const [data, setData] = useState([]);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [userInteractions, setUserInteractions] = useState({});

  useEffect(() => {
    // Select 7 random facts
    const shuffled = [...allData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 7);
    setData(selected);

    // Initialize random like and dislike counts
    const initialLikes = {};
    const initialDislikes = {};
    selected.forEach((item, index) => {
      initialLikes[index] = Math.floor(Math.random() * 100);
      initialDislikes[index] = Math.floor(Math.random() * 100);
    });
    setLikes(initialLikes);
    setDislikes(initialDislikes);
  }, []);

  const handleLike = (index) => {
    if (userInteractions[index] !== "like") {
      setLikes((prev) => ({ ...prev, [index]: prev[index] + 1 }));
      if (userInteractions[index] === "dislike") {
        setDislikes((prev) => ({ ...prev, [index]: prev[index] - 1 }));
      }
      setUserInteractions((prev) => ({ ...prev, [index]: "like" }));
    }
  };

  const handleDislike = (index) => {
    if (userInteractions[index] !== "dislike") {
      setDislikes((prev) => ({ ...prev, [index]: prev[index] + 1 }));
      if (userInteractions[index] === "like") {
        setLikes((prev) => ({ ...prev, [index]: prev[index] - 1 }));
      }
      setUserInteractions((prev) => ({ ...prev, [index]: "dislike" }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Tide Wiki</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.contentContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.interactionContainer}>
                  <TouchableOpacity
                    onPress={() => handleLike(index)}
                    style={styles.interactionButton}
                  >
                    <Ionicons
                      name="thumbs-up"
                      size={20}
                      color={
                        userInteractions[index] === "like" ? "#007AFF" : "#999"
                      }
                    />
                    <Text style={styles.interactionText}>{likes[index]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDislike(index)}
                    style={styles.interactionButton}
                  >
                    <Ionicons
                      name="thumbs-down"
                      size={20}
                      color={
                        userInteractions[index] === "dislike"
                          ? "#FF3B30"
                          : "#999"
                      }
                    />
                    <Text style={styles.interactionText}>
                      {dislikes[index]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B1F0F7",
  },
  pageTitle: {
    fontSize: 24,
    marginTop: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#007AFF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  interactionContainer: {
    flexDirection: "row",
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  interactionText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
