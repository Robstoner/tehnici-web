--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-05-16 20:44:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16429)
-- Name: produse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produse (
    id integer NOT NULL,
    nume character varying NOT NULL,
    descriere character varying,
    categorie character varying NOT NULL,
    subcategorie character varying,
    pret double precision NOT NULL,
    dimensiuni character varying,
    "dataLansare" date NOT NULL,
    accesorii character varying,
    fragil boolean,
    culori public.culori,
    poza character varying
);


ALTER TABLE public.produse OWNER TO postgres;

--
-- TOC entry 3174 (class 2606 OID 16435)
-- Name: produse produse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_pkey PRIMARY KEY (id);


-- Completed on 2023-05-16 20:44:09

--
-- PostgreSQL database dump complete
--

