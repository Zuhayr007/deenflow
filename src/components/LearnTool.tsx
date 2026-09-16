import { Link } from "@tanstack/react-router";

export default function LearnTool() {
  return (
    <div className="space-y-5 text-sm leading-relaxed">
      <section className="panel space-y-3">
        <h2 className="text-xl">Start with a trusted teacher</h2>
        <p>
          This short orientation helps you find the next step. A local imam or
          teacher can demonstrate the prayer and explain the practice you
          follow. Details differ between schools; this page is not a complete
          fiqh manual or a scholar-reviewed course.
        </p>
      </section>
      <section className="panel space-y-3">
        <h2 className="text-xl">Prepare for salah</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Check that the prayer time has begun and prepare a suitable place.
          </li>
          <li>
            Learn purification and wudu. Quran 5:6 describes washing the face
            and arms, wiping the head and washing the feet; ask a teacher to
            demonstrate the full sequence.
          </li>
          <li>
            Face the Qibla, with appropriate covering, and intend your prayer.
          </li>
        </ol>
        <a className="text-primary underline" href="https://quran.com/5/6">
          Read Quran 5:6
        </a>
        <br />
        <Link className="text-primary" to="/tools/qibla">
          Find the Qibla →
        </Link>
      </section>
      <section className="panel space-y-3">
        <h2 className="text-xl">Learn the movements and recitation</h2>
        <p>
          Learn standing, bowing, prostration and sitting through a live
          demonstration. Begin practising Al-Fatihah and short surahs using
          Arabic, transliteration and recitation together. Transliteration is a
          learning aid and cannot capture every Arabic sound.
        </p>
        <Link className="action" to="/quran/1">
          Learn Al-Fatihah with audio
        </Link>
        <Link className="action secondary" to="/quran/112">
          Practise Al-Ikhlas
        </Link>
        <p>
          The instruction to learn prayer from the Prophet's example appears in{" "}
          <a className="underline" href="https://sunnah.com/bukhari:631">
            Sahih al-Bukhari 631
          </a>
          .
        </p>
      </section>
      <section className="panel">
        <h2 className="text-xl mb-3">Build confidence gradually</h2>
        <p>
          Ask your teacher about prayer units, recitations, what invalidates
          wudu, and situations such as illness or travel. DeenFlow helps with
          times and practice; a qualified teacher can answer your individual
          questions.
        </p>
      </section>
    </div>
  );
}
