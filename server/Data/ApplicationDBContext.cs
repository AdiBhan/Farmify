using Microsoft.EntityFrameworkCore;
using FarmifyService.models;

namespace FarmifyService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Buyer> Buyers { get; set; }
        public DbSet<Seller> Sellers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<CreditCard> CreditCards { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>().ToTable("Product", "public");

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User", "public");
                entity.HasKey(e => e.ID);
                
                entity.Property(e => e.ID)
                    .HasColumnType("character");
                
                entity.Property(e => e.Email)
                    .HasColumnType("character varying")
                    .IsRequired();
                
                entity.Property(e => e.Username)
                    .HasColumnType("character varying")
                    .IsRequired();
                
                entity.Property(e => e.Password)
                    .HasColumnType("character varying")
                    .IsRequired();
                
                entity.Property(e => e.sessionID)
                    .HasColumnType("character");
                
                entity.Property(e => e.Credits)
                    .HasColumnType("integer")
                    .IsRequired();
                
                entity.Property(e => e.AccountType)
                    .HasColumnType("text");
                
                entity.Property(e => e.DateCreated)
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .IsRequired();

                // Add unique constraint on email
                entity.HasIndex(e => e.Email)
                    .IsUnique();

                // Configure one-to-one relationship with Buyer
                entity.HasOne(u => u.Buyer)
                    .WithOne(b => b.User)
                    .HasForeignKey<Buyer>(b => b.UserID)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure one-to-one relationship with Seller
                entity.HasOne(u => u.Seller)
                    .WithOne(s => s.User)
                    .HasForeignKey<Seller>(s => s.UserID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Buyer>(entity =>
            {
                entity.ToTable("Buyer", "public");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.UserID)
                    .HasColumnType("character"); 
            });

            modelBuilder.Entity<Seller>(entity =>
            {
                entity.ToTable("Seller", "public");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.UserID)
                    .HasColumnType("character"); 
            });
        }
    }
}