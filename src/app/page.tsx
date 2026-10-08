import Link from "next/link";
import { AMENITIES, BENEFITS, MISSION_STATEMENT } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Our Mission</h1>
        <p>{MISSION_STATEMENT}</p>
        <Link href="/planets" className="button">
          Browse destinations
        </Link>
      </section>

      <div className="feature-columns">
        <section>
          <h2>Benefits</h2>
          <ul>
            {BENEFITS.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Amenities</h2>
          <ul>
            {AMENITIES.map((amenity) => (
              <li key={amenity}>{amenity}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
